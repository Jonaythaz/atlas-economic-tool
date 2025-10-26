mod models;
mod xml_helper;

pub use models::{CreditNote, CreditNoteLine, Document, Invoice, InvoiceLine};

pub async fn load_documents() -> Result<Vec<Document>, xml_helper::Error> {
    xml_helper::pick_data_folder().await
}
