use crate::{app::models::Invoice, core};

#[tauri::command]
pub async fn load_invoices() -> Result<Vec<Invoice>, String> {
    let invoices = core::load_documents()
        .await
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(Invoice::from)
        .collect();

    Ok(invoices)
}
