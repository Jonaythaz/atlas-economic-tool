use crate::external::{
    clients::{
        helper::{get, parse_response},
        post, MOCK_MODE,
    },
    models::{
        AccountingEntriesResponse, AccountingYear, AccountingYearsResponse, Invoice,
        InvoiceBookRequest, InvoiceResponse, ManualDebtorInvoicePage,
    },
    ClientError, ClientResult,
};

const ACCOUNTING_ENTRIES_PAGE_SIZE: u32 = 1_000;

pub async fn post_invoice(invoice: &Invoice, secret: &str, grant: &str) -> ClientResult<i32> {
    if MOCK_MODE {
        return post_invoice_mock(invoice).await;
    }

    let response = post(
        "https://restapi.e-conomic.com/invoices/drafts",
        invoice,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    parse_response::<InvoiceResponse>(response)
        .await
        .map(|response| response.id)
}

pub async fn book_invoice(
    request: &InvoiceBookRequest,
    secret: &str,
    grant: &str,
) -> ClientResult<()> {
    let response = post(
        "https://restapi.e-conomic.com/invoices/booked",
        request,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(ClientError::async_from(response).await)
    }
}

pub async fn is_invoice_booked(id: i32, secret: &str, grant: &str) -> ClientResult<bool> {
    match get(
        format!("https://restapi.e-conomic.com/invoices/booked/{id}"),
        secret,
        grant,
    )
    .await
    {
        Ok(response) if response.status() == surf::StatusCode::Ok => Ok(true),
        Ok(response) if response.status() == surf::StatusCode::NotFound => Ok(false),
        Ok(response) => Err(ClientError::async_from(response).await),
        Err(err) if err.status() == surf::StatusCode::NotFound => Ok(false),
        Err(err) => Err(err.into()),
    }
}

pub async fn get_accounting_years(secret: &str, grant: &str) -> ClientResult<Vec<AccountingYear>> {
    let mut skip_pages = 0_u32;
    let mut years = Vec::new();
    loop {
        let url = format!(
            "https://restapi.e-conomic.com/accounting-years?pagesize={ACCOUNTING_ENTRIES_PAGE_SIZE}&skippages={skip_pages}"
        );
        let response = get(url, secret, grant).await.map_err(ClientError::from)?;
        let response = parse_response::<AccountingYearsResponse>(response).await?;
        let has_more = response.pagination.has_more();
        years.extend(response.collection);
        if !has_more {
            return Ok(years);
        }
        skip_pages = skip_pages.checked_add(1).ok_or_else(|| {
            ClientError::FailedResponse("Accounting-year pagination overflowed.".to_string())
        })?;
    }
}

pub async fn get_manual_debtor_invoice_page(
    entries_url: &str,
    skip_pages: u32,
    secret: &str,
    grant: &str,
) -> ClientResult<ManualDebtorInvoicePage> {
    let url = entries_page_url(entries_url, skip_pages);
    let response = get(url, secret, grant).await.map_err(ClientError::from)?;
    let response = parse_response::<AccountingEntriesResponse>(response).await?;
    let entry_count = response.collection.len();
    let page_size = response.pagination.page_size;
    let has_more = response.pagination.has_more();
    let invoice_ids = response
        .collection
        .into_iter()
        .filter_map(|entry| entry.invoice_number)
        .map(|invoice_number| {
            invoice_number.parse::<i32>().map_err(|error| {
                ClientError::FailedResponse(format!(
                    "Manual debtor invoice number {invoice_number:?} is not a valid invoice ID: {error}"
                ))
            })
        })
        .collect::<ClientResult<Vec<_>>>()?;

    Ok(ManualDebtorInvoicePage {
        entry_count,
        page_size,
        invoice_ids,
        has_more,
    })
}

fn entries_page_url(entries_url: &str, skip_pages: u32) -> String {
    let separator = if entries_url.contains('?') { '&' } else { '?' };
    format!(
        "{entries_url}{separator}filter=entryType%24eq%3AmanualDebtorInvoice&pagesize={ACCOUNTING_ENTRIES_PAGE_SIZE}&skippages={skip_pages}"
    )
}

async fn post_invoice_mock(invoice: &Invoice) -> ClientResult<i32> {
    println!("Posting invoice to mock endpoint...");
    println!(
        "Invoice: {:?}",
        serde_json::to_string_pretty(invoice).unwrap_or_else(|_| "unparsable invoice".to_string())
    );
    Ok(1)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn entries_page_url_uses_provided_link_and_encoded_filter() {
        assert_eq!(
            entries_page_url(
                "https://restapi.e-conomic.com/accounting-years/2025%2F2026/entries?demo=true",
                2
            ),
            "https://restapi.e-conomic.com/accounting-years/2025%2F2026/entries?demo=true&filter=entryType%24eq%3AmanualDebtorInvoice&pagesize=1000&skippages=2"
        );
    }
}
