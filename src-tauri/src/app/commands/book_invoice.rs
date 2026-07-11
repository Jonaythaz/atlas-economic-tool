use crate::app::models::{InvoiceBooking, Tokens};

#[tauri::command]
pub async fn book_invoice(invoice: InvoiceBooking, tokens: Tokens) -> Result<(), String> {
    crate::external::book_invoice(&invoice.into(), &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| err.to_string())?;

    Ok(())
}
