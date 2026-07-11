use serde::Deserialize;

#[derive(Deserialize)]
pub struct InvoiceResponse {
    #[serde(rename = "draftInvoiceNumber")]
    pub id: i32,
}
