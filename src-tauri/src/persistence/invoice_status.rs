use rusqlite::{Connection, OptionalExtension, Result};

const NEGATIVE_STATUS_TTL_SECONDS: i64 = 300;

#[derive(Debug, PartialEq, Eq)]
pub struct AccountingYearProgress {
    pub next_page: u32,
    pub completed: bool,
}

#[derive(Debug, PartialEq, Eq)]
pub struct InvoiceScanMetadata {
    pub catch_up_complete: bool,
    pub newest_year: Option<String>,
}

pub fn find_invoice_status(conn: &Connection, invoice_id: i32, now: i64) -> Result<Option<bool>> {
    conn.query_row(
        "SELECT is_booked FROM invoice_status
         WHERE invoice_id = ?1
           AND (is_booked = 1 OR checked_at >= ?2)",
        rusqlite::params![invoice_id, now - NEGATIVE_STATUS_TTL_SECONDS],
        |row| row.get(0),
    )
    .optional()
}

pub fn upsert_invoice_status(
    conn: &Connection,
    invoice_id: i32,
    is_booked: bool,
    checked_at: i64,
) -> Result<()> {
    conn.execute(
        "INSERT INTO invoice_status(invoice_id, is_booked, checked_at)
         VALUES (?1, ?2, ?3)
         ON CONFLICT(invoice_id) DO UPDATE SET
             is_booked = MAX(invoice_status.is_booked, excluded.is_booked),
             checked_at = CASE
                 WHEN invoice_status.is_booked = 1 THEN invoice_status.checked_at
                 ELSE excluded.checked_at
             END",
        rusqlite::params![invoice_id, is_booked, checked_at],
    )
    .map(|_| ())
}

pub fn get_accounting_year_progress(
    conn: &Connection,
    year: &str,
) -> Result<Option<AccountingYearProgress>> {
    conn.query_row(
        "SELECT next_page, completed FROM accounting_year_scan WHERE year = ?1",
        [year],
        |row| {
            Ok(AccountingYearProgress {
                next_page: row.get(0)?,
                completed: row.get(1)?,
            })
        },
    )
    .optional()
}

pub fn store_manual_invoice_page(
    conn: &Connection,
    year: &str,
    invoice_ids: &[i32],
    next_page: u32,
    completed: bool,
    checked_at: i64,
) -> Result<()> {
    let tx = conn.unchecked_transaction()?;
    for invoice_id in invoice_ids {
        tx.execute(
            "INSERT INTO invoice_status(invoice_id, is_booked, checked_at)
             VALUES (?1, 1, ?2)
             ON CONFLICT(invoice_id) DO UPDATE SET
                 is_booked = 1,
                 checked_at = excluded.checked_at",
            rusqlite::params![invoice_id, checked_at],
        )?;
    }
    tx.execute(
        "INSERT INTO accounting_year_scan(year, next_page, completed)
         VALUES (?1, ?2, ?3)
         ON CONFLICT(year) DO UPDATE SET
             next_page = excluded.next_page,
             completed = excluded.completed",
        rusqlite::params![year, next_page, completed],
    )?;
    tx.commit()
}

pub fn get_invoice_scan_metadata(conn: &Connection) -> Result<Option<InvoiceScanMetadata>> {
    conn.query_row(
        "SELECT catch_up_complete, newest_year FROM invoice_scan_metadata WHERE id = 1",
        [],
        |row| {
            Ok(InvoiceScanMetadata {
                catch_up_complete: row.get(0)?,
                newest_year: row.get(1)?,
            })
        },
    )
    .optional()
}

pub fn set_invoice_scan_metadata(
    conn: &Connection,
    catch_up_complete: bool,
    newest_year: &str,
) -> Result<()> {
    conn.execute(
        "INSERT INTO invoice_scan_metadata(id, catch_up_complete, newest_year)
         VALUES (1, ?1, ?2)
         ON CONFLICT(id) DO UPDATE SET
             catch_up_complete = excluded.catch_up_complete,
             newest_year = excluded.newest_year",
        rusqlite::params![catch_up_complete, newest_year],
    )
    .map(|_| ())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::persistence::open_in_memory_connection;

    #[test]
    fn invoice_status_cache_expires_negative_statuses_only() {
        let conn = open_in_memory_connection();
        upsert_invoice_status(&conn, 100, false, 1_000).expect("insert negative status");
        upsert_invoice_status(&conn, 101, true, 1_000).expect("insert positive status");

        assert_eq!(
            find_invoice_status(&conn, 100, 1_299).expect("fresh"),
            Some(false)
        );
        assert_eq!(
            find_invoice_status(&conn, 100, 1_301).expect("expired"),
            None
        );
        assert_eq!(
            find_invoice_status(&conn, 101, 1_301).expect("positive"),
            Some(true)
        );
    }

    #[test]
    fn a_negative_lookup_cannot_overwrite_a_known_booked_invoice() {
        let conn = open_in_memory_connection();
        upsert_invoice_status(&conn, 102, true, 1_000).expect("booked status");
        upsert_invoice_status(&conn, 102, false, 1_001).expect("negative lookup");

        assert_eq!(
            find_invoice_status(&conn, 102, 1_001).expect("status"),
            Some(true)
        );
    }

    #[test]
    fn manual_invoice_page_and_progress_are_stored_together() {
        let conn = open_in_memory_connection();
        store_manual_invoice_page(&conn, "2026", &[12, 13], 4, false, 1_000).expect("store page");

        assert_eq!(
            find_invoice_status(&conn, 12, 1_000).expect("invoice"),
            Some(true)
        );
        assert_eq!(
            get_accounting_year_progress(&conn, "2026").expect("progress"),
            Some(AccountingYearProgress {
                next_page: 4,
                completed: false
            })
        );
    }

    #[test]
    fn scan_metadata_can_be_loaded_and_updated() {
        let conn = open_in_memory_connection();
        assert_eq!(get_invoice_scan_metadata(&conn).expect("missing"), None);

        set_invoice_scan_metadata(&conn, true, "2026").expect("set metadata");
        assert_eq!(
            get_invoice_scan_metadata(&conn).expect("metadata"),
            Some(InvoiceScanMetadata {
                catch_up_complete: true,
                newest_year: Some("2026".to_string())
            })
        );
    }
}
