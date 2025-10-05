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

impl Default for Recipient {
    fn default() -> Self {
        Self {
            name: String::from("PFA PENSION, FORSIKRINGSAKTIESELSKAB."),
            vat_zone: Default::default(),
        }
    }
}

impl Default for Invoice {
    fn default() -> Self {
        Self {
            currency: String::from("DKK"),
            customer: Default::default(),
            date: chrono::Local::now().date_naive().to_string(),
            layout: Default::default(),
            payment_terms: Default::default(),
            recipient: Default::default(),
            references: Default::default(),
            lines: Default::default(),
        }
    }
}

impl Invoice {
    pub fn new_pfa_paid(lines: Vec<InvoiceLine>, damage_number: String) -> Self {
        Self {
            lines,
            references: Some(References {
                other: damage_number,
            }),
            ..Default::default()
        }
    }

    pub fn new_self_paid(
        lines: Vec<InvoiceLine>,
        customer_number: i32,
        recipient_name: String,
    ) -> Self {
        Self {
            lines,
            customer: Customer {
                number: customer_number,
            },
            recipient: Recipient {
                name: recipient_name,
                vat_zone: Default::default(),
            },
            ..Default::default()
        }
    }
}
