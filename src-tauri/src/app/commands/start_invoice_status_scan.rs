use std::time::{SystemTime, UNIX_EPOCH};

use tauri::{AppHandle, Manager, State};

use crate::{
    app::{models::Tokens, AppState, DatabaseAccess},
    external::{
        get_accounting_years, get_manual_debtor_invoice_page,
        models::{AccountingYear, ManualDebtorInvoicePage},
    },
    persistence::{
        get_accounting_year_progress, get_invoice_scan_metadata, set_invoice_scan_metadata,
        store_manual_invoice_page, AccountingYearProgress, InvoiceScanMetadata,
    },
};

#[tauri::command]
pub fn start_invoice_status_scan(
    app: AppHandle,
    state: State<'_, AppState>,
    tokens: Tokens,
) -> Result<(), String> {
    if credentials_are_missing(&tokens) || !state.try_start_invoice_scan() {
        return Ok(());
    }

    tauri::async_runtime::spawn(async move {
        if let Err(error) = scan_manual_debtor_invoices(app, tokens).await {
            eprintln!("Background manual debtor invoice scan failed: {error}");
        }
    });
    Ok(())
}

fn credentials_are_missing(tokens: &Tokens) -> bool {
    tokens.secret.trim().is_empty() || tokens.grant.trim().is_empty()
}

async fn scan_manual_debtor_invoices(app: AppHandle, tokens: Tokens) -> Result<(), String> {
    let years = load_accounting_years(&tokens).await?;
    let metadata = load_scan_metadata(&app)?;
    let targets = select_scan_targets(&years, metadata.as_ref())?;

    for target in targets {
        scan_target_year(&app, &tokens, target).await?;
    }

    mark_initial_catch_up_complete(&app, &years)
}

async fn load_accounting_years(tokens: &Tokens) -> Result<Vec<AccountingYear>, String> {
    let years = get_accounting_years(&tokens.secret, &tokens.grant)
        .await
        .map_err(|error| error.to_string())?;
    let mut seen_years = std::collections::HashSet::new();
    let years = years
        .into_iter()
        .filter(|year| seen_years.insert(year.year.clone()))
        .collect::<Vec<_>>();

    if years.is_empty() {
        return Err("No accounting years were returned by e-conomic.".to_string());
    }
    Ok(years)
}

fn select_scan_targets(
    years: &[AccountingYear],
    metadata: Option<&InvoiceScanMetadata>,
) -> Result<Vec<ScanTarget>, String> {
    let newest_year = newest_accounting_year(years)?;
    match metadata.filter(|metadata| metadata.catch_up_complete) {
        Some(metadata) => select_resume_targets(years, metadata, newest_year),
        None => Ok(targets_with_latest_year_open(years, newest_year)),
    }
}

fn newest_accounting_year(years: &[AccountingYear]) -> Result<&AccountingYear, String> {
    years
        .last()
        .ok_or_else(|| "No accounting years were returned by e-conomic.".to_string())
}

fn select_resume_targets(
    years: &[AccountingYear],
    metadata: &InvoiceScanMetadata,
    newest_year: &AccountingYear,
) -> Result<Vec<ScanTarget>, String> {
    let previous_newest = metadata
        .newest_year
        .as_ref()
        .ok_or_else(|| "Invoice scan metadata is missing the newest year.".to_string())?;

    match years.iter().position(|year| &year.year == previous_newest) {
        Some(previous_index) => {
            let new_years = years
                .iter()
                .skip(previous_index + 1)
                .cloned()
                .collect::<Vec<_>>();
            if new_years.is_empty() {
                Ok(vec![ScanTarget::newest_year(newest_year.clone())])
            } else {
                Ok(targets_with_latest_year_open(&new_years, newest_year))
            }
        }
        None => Ok(targets_with_latest_year_open(years, newest_year)),
    }
}

fn targets_with_latest_year_open(
    years: &[AccountingYear],
    newest_year: &AccountingYear,
) -> Vec<ScanTarget> {
    years
        .iter()
        .map(|year| ScanTarget::catch_up_year(year.clone(), newest_year))
        .collect()
}

#[derive(Debug, PartialEq, Eq)]
struct ScanTarget {
    accounting_year: AccountingYear,
    complete_when_caught_up: bool,
}

impl ScanTarget {
    fn newest_year(accounting_year: AccountingYear) -> Self {
        Self {
            accounting_year,
            complete_when_caught_up: false,
        }
    }

    fn catch_up_year(accounting_year: AccountingYear, newest_year: &AccountingYear) -> Self {
        let complete_when_caught_up = accounting_year.year != newest_year.year;
        Self {
            accounting_year,
            complete_when_caught_up,
        }
    }
}

async fn scan_target_year(
    app: &AppHandle,
    tokens: &Tokens,
    target: ScanTarget,
) -> Result<(), String> {
    let year = &target.accounting_year;
    let progress = load_year_progress(app, &year.year)?;
    if progress.completed && target.complete_when_caught_up {
        return Ok(());
    }

    scan_year_pages(
        app,
        tokens,
        year,
        progress.next_page,
        target.complete_when_caught_up,
    )
    .await
}

async fn scan_year_pages(
    app: &AppHandle,
    tokens: &Tokens,
    year: &AccountingYear,
    mut next_page: u32,
    complete_when_caught_up: bool,
) -> Result<(), String> {
    loop {
        let page = fetch_accounting_entries_page(tokens, year, next_page).await?;
        let page_progress =
            save_accounting_entries_page(app, year, next_page, page, complete_when_caught_up)?;
        if !page_progress.has_more {
            return Ok(());
        }
        next_page = page_progress.next_page;
    }
}

async fn fetch_accounting_entries_page(
    tokens: &Tokens,
    year: &AccountingYear,
    page_number: u32,
) -> Result<ManualDebtorInvoicePage, String> {
    get_manual_debtor_invoice_page(&year.entries, page_number, &tokens.secret, &tokens.grant)
        .await
        .map_err(|error| error.to_string())
}

fn save_accounting_entries_page(
    app: &AppHandle,
    year: &AccountingYear,
    page_number: u32,
    page: ManualDebtorInvoicePage,
    complete_when_caught_up: bool,
) -> Result<PageProgress, String> {
    if page.has_more && page.entry_count == 0 {
        return Err(format!(
            "Accounting year {} reported more entries after an empty page.",
            year.year
        ));
    }

    let next_page = next_page_cursor(page_number, &page, complete_when_caught_up)
        .ok_or_else(|| format!("Accounting year {} pagination overflowed.", year.year))?;
    let completed = complete_when_caught_up && !page.has_more;
    let checked_at = current_unix_timestamp()?;

    with_db(app, |conn| {
        store_manual_invoice_page(
            conn,
            &year.year,
            &page.invoice_ids,
            next_page,
            completed,
            checked_at,
        )
    })?;

    Ok(PageProgress {
        next_page,
        has_more: page.has_more,
    })
}

fn next_page_cursor(
    current_page: u32,
    page: &ManualDebtorInvoicePage,
    complete_when_caught_up: bool,
) -> Option<u32> {
    let should_advance =
        page.has_more || complete_when_caught_up || page.entry_count >= page.page_size as usize;
    if should_advance && page.entry_count > 0 {
        current_page.checked_add(1)
    } else {
        Some(current_page)
    }
}

struct PageProgress {
    next_page: u32,
    has_more: bool,
}

fn load_year_progress(app: &AppHandle, year: &str) -> Result<AccountingYearProgress, String> {
    with_db(app, |conn| get_accounting_year_progress(conn, year)).map(|progress| {
        progress.unwrap_or(AccountingYearProgress {
            next_page: 0,
            completed: false,
        })
    })
}

fn load_scan_metadata(app: &AppHandle) -> Result<Option<InvoiceScanMetadata>, String> {
    with_db(app, get_invoice_scan_metadata)
}

fn mark_initial_catch_up_complete(app: &AppHandle, years: &[AccountingYear]) -> Result<(), String> {
    let newest_year = newest_accounting_year(years)?;
    with_db(app, |conn| {
        set_invoice_scan_metadata(conn, true, &newest_year.year)
    })
}

fn with_db<T, E>(
    app: &AppHandle,
    operation: impl FnOnce(&rusqlite::Connection) -> Result<T, E>,
) -> Result<T, String>
where
    E: std::fmt::Display,
{
    app.state::<AppState>()
        .db(operation)
        .map_err(|error| error.to_string())
}

fn current_unix_timestamp() -> Result<i64, String> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .map_err(|error| format!("System clock is before the Unix epoch: {error}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    fn year(year: &str) -> AccountingYear {
        AccountingYear {
            year: year.to_string(),
            entries: format!("https://restapi.e-conomic.com/accounting-years/{year}/entries"),
        }
    }

    fn target_year_names(targets: &[ScanTarget]) -> Vec<(&str, bool)> {
        targets
            .iter()
            .map(|target| {
                (
                    target.accounting_year.year.as_str(),
                    target.complete_when_caught_up,
                )
            })
            .collect()
    }

    #[test]
    fn initial_scan_catches_up_old_years_and_keeps_latest_open() {
        let targets =
            select_scan_targets(&[year("2024"), year("2025/2026")], None).expect("targets");
        assert_eq!(
            target_year_names(&targets),
            vec![("2024", true), ("2025/2026", false)]
        );
    }

    #[test]
    fn existing_scan_only_resumes_latest_year() {
        let metadata = InvoiceScanMetadata {
            catch_up_complete: true,
            newest_year: Some("2025".to_string()),
        };
        let targets =
            select_scan_targets(&[year("2024"), year("2025")], Some(&metadata)).expect("targets");
        assert_eq!(target_year_names(&targets), vec![("2025", false)]);
    }

    #[test]
    fn rollover_scans_new_years_and_leaves_only_newest_open() {
        let metadata = InvoiceScanMetadata {
            catch_up_complete: true,
            newest_year: Some("2025".to_string()),
        };
        let targets = select_scan_targets(
            &[year("2024"), year("2025"), year("2026"), year("2027")],
            Some(&metadata),
        )
        .expect("targets");
        assert_eq!(
            target_year_names(&targets),
            vec![("2026", true), ("2027", false)]
        );
    }

    #[test]
    fn an_open_year_revisits_its_partial_final_page() {
        let page = ManualDebtorInvoicePage {
            invoice_ids: vec![1],
            entry_count: 100,
            page_size: 1_000,
            has_more: false,
        };
        assert_eq!(next_page_cursor(3, &page, false), Some(3));
    }

    #[test]
    fn full_final_page_advances_for_future_entries() {
        let page = ManualDebtorInvoicePage {
            invoice_ids: vec![1],
            entry_count: 1_000,
            page_size: 1_000,
            has_more: false,
        };
        assert_eq!(next_page_cursor(3, &page, false), Some(4));
    }
}
