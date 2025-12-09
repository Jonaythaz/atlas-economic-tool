use crate::core::models::Document;

pub mod models;
mod xml_helper;

pub async fn load_documents() -> Result<Vec<Document>, xml_helper::Error> {
    xml_helper::pick_data_folder().await
}
