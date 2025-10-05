mod models;
mod xml_helper;

pub use models::{Invoice, InvoiceLine};

pub async fn load_invoices() -> Result<Vec<Invoice>, xml_helper::Error> {
    xml_helper::pick_data_folder().await
}
