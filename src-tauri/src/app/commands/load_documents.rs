use std::collections::HashSet;

use crate::{app::models::Document, core};

#[tauri::command]
pub async fn load_documents() -> Result<HashSet<Document>, String> {
    let invoices = core::load_documents()
        .await
        .map_err(|e| e.to_string())?
        .into_iter()
        .map(Document::from)
        .collect();

    Ok(invoices)
}
