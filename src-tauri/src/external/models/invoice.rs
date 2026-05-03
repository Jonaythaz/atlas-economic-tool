use serde::Serialize;

use crate::external::models::{InvoiceLine, PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize)]
pub struct Invoice {
    #[serde(rename = "currency")]
    pub currency: String,

    #[serde(rename = "customer")]
    pub customer: InvoiceCustomer,

    #[serde(rename = "date")]
    pub date: String,

    #[serde(rename = "layout")]
    pub layout: InvoiceLayout,

    #[serde(rename = "paymentTerms")]
    pub payment_terms: PaymentTerms,

    #[serde(rename = "recipient")]
    pub recipient: InvoiceRecipient,

    #[serde(rename = "references", skip_serializing_if = "Option::is_none")]
    pub references: Option<InvoiceReferences>,

    #[serde(rename = "lines")]
    pub lines: Vec<InvoiceLine>,
}

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceCustomer {
    #[serde(rename = "customerNumber")]
    pub number: i32,
}

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceLayout {
    #[serde(rename = "layoutNumber")]
    pub number: i32,
}

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceRecipient {
    #[serde(rename = "ean", skip_serializing_if = "Option::is_none")]
    pub ean: Option<String>,

    #[serde(rename = "nemHandelType", skip_serializing_if = "Option::is_none")]
    pub recieval_method: Option<InvoiceRecievalMethod>,

    #[serde(rename = "name")]
    pub name: String,

    #[serde(rename = "address")]
    pub street: String,

    #[serde(rename = "city")]
    pub city: String,

    #[serde(rename = "zip")]
    pub postal_code: String,

    #[serde(rename = "country")]
    pub country: String,

    #[serde(rename = "vatZone")]
    pub vat_zone: VatZone,
}

#[derive(Debug, Clone, Serialize)]
pub enum InvoiceRecievalMethod {
    #[serde(rename = "ean")]
    EAN,
}

#[derive(Debug, Default, Clone, Serialize)]
pub struct InvoiceReferences {
    #[serde(rename = "other")]
    pub other: String,
}
