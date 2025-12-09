use std::collections::HashSet;

use crate::{app::models::Invoice, core};

#[tauri::command]
pub async fn load_invoices() -> Result<HashSet<Invoice>, String> {
    let invoices = core::load_documents()
        .await
        .map_err(|e| e.to_string())?
        .into_iter()
        .filter(|document| match document {
            crate::core::models::Document::Invoice(_) => true,
            crate::core::models::Document::CreditNote(_) => false,
        })
        .map(Invoice::from)
        .collect();

    Ok(invoices)
}
