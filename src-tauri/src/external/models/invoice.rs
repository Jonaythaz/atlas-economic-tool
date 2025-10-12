use serde::Serialize;

use crate::external::models::{InvoiceLine, PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize)]
pub struct Invoice {
    #[serde(rename = "currency")]
    currency: String,
    #[serde(rename = "customer")]
    customer: Customer,
    #[serde(rename = "date")]
    date: String,
    #[serde(rename = "layout")]
    layout: Layout,
    #[serde(rename = "paymentTerms")]
    payment_terms: PaymentTerms,
    #[serde(rename = "recipient")]
    recipient: Recipient,
    #[serde(rename = "references")]
    references: Option<References>,
    #[serde(rename = "lines")]
    lines: Vec<InvoiceLine>,
}

#[derive(Debug, Clone, Serialize)]
struct Customer {
    #[serde(rename = "customerNumber")]
    number: i32,
}

#[derive(Debug, Clone, Serialize)]
struct Layout {
    #[serde(rename = "layoutNumber")]
    number: i32,
}

#[derive(Debug, Clone, Serialize)]
struct Recipient {
    #[serde(rename = "name")]
    name: String,
    #[serde(rename = "vatZone")]
    vat_zone: VatZone,
}

#[derive(Debug, Default, Clone, Serialize)]
struct References {
    #[serde(rename = "other")]
    other: String,
}

impl Default for Layout {
    fn default() -> Self {
        Self { number: 21 }
    }
}

impl Default for Customer {
    fn default() -> Self {
        Self { number: 1 }
    }
}
