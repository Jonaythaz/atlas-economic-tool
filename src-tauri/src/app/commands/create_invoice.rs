use crate::app::models::{NewInvoice, Tokens};
use crate::external::post_invoice;

#[tauri::command]
pub async fn create_invoice(invoice: NewInvoice, tokens: Tokens) -> Result<(), String> {
    let external_invoice = invoice.into();
    post_invoice(&external_invoice, &tokens.secret, &tokens.grant)
        .await
        .map_err(|e| e.to_string())
}
