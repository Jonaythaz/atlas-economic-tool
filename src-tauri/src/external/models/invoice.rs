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
    #[serde(rename = "ean")]
    ean: String,

    #[serde(rename = "name")]
    name: String,

    #[serde(rename = "address")]
    street: String,

    #[serde(rename = "city")]
    city: String,

    #[serde(rename = "zip")]
    postal_code: String,

    #[serde(rename = "country")]
    country: String,

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
        recipient_ean: String,
        recipient_name: String,
        recipient_street: String,
        recipient_city: String,
        recipient_postal_code: String,
        recipient_country: String,
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
                ean: recipient_ean,
                name: recipient_name,
                street: recipient_street,
                city: recipient_city,
                postal_code: recipient_postal_code,
                country: recipient_country,
                vat_zone: VatZone { id: vat_zone },
            },
            references: damage_number.map(|dn| References { other: dn }),
            lines,
        }
    }
}
