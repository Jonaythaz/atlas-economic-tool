use std::time::{SystemTime, UNIX_EPOCH};

use tauri::State;

use crate::{
    app::{
        models::{InvoiceBooking, Tokens},
        AppState, DatabaseAccess,
    },
    persistence::upsert_invoice_status,
};

#[tauri::command]
pub async fn book_invoice(
    invoice: InvoiceBooking,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<(), String> {
    let invoice_id = invoice.invoice_id();
    crate::external::book_invoice(&invoice.into(), &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| err.to_string())?;

    let checked_at = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .map_err(|error| format!("System clock is before the Unix epoch: {error}"))?;
    state
        .db(|conn| upsert_invoice_status(conn, invoice_id, true, checked_at))
        .map_err(|error| error.to_string())?;

    Ok(())
}
