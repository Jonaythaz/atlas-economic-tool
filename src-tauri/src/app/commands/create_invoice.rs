use crate::app::models::NewInvoice;
use crate::external::post_invoice;

#[tauri::command]
pub async fn create_invoice(invoice: NewInvoice, secret: String, grant: String) -> Result<(), String> {
    let external_invoice = invoice.into();
    post_invoice(&external_invoice, &secret, &grant)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}