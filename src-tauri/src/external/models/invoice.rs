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
    #[serde(rename = "references", skip_serializing_if = "Option::is_none")]
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

impl Invoice {
    pub fn new(
        date: String,
        layout: i32,
        customer: i32,
        recipient: String,
        payment_terms: i32,
        vat_zone: i32,
        damage_number: Option<String>,
        lines: Vec<InvoiceLine>,
    ) -> Self {
        Self {
            currency: "DKK".to_string(),
            customer: Customer { number: customer },
            date,
            layout: Layout { number: layout },
            payment_terms: PaymentTerms { id: payment_terms },
            recipient: Recipient {
                name: recipient,
                vat_zone: VatZone { id: vat_zone },
            },
            references: damage_number.map(|dn| References { other: dn }),
            lines,
        }
    }
}