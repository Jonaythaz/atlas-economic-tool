use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct BillingReference {
    #[serde(rename = "InvoiceDocumentReference")]
    pub invoice_reference: InvoiceReference,
}

#[derive(Debug, Deserialize)]
pub struct InvoiceReference {
    #[serde(rename = "ID")]
    pub id: String,
}
