use std::collections::HashMap;

use crate::app::models::{
    BusinessDocumentCustomer, Document, DocumentProduct, PrivateDocumentCustomer,
};

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Documents {
    pub documents: Vec<Document>,
    pub private_customer_map: HashMap<String, PrivateDocumentCustomer>,
    pub business_customer_map: HashMap<String, BusinessDocumentCustomer>,
    pub product_map: HashMap<String, DocumentProduct>,
}
