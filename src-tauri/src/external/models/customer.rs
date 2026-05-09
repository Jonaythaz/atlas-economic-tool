use serde::{Deserialize, Serialize};

use super::{PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    #[serde(rename = "customerNumber")]
    pub id: i32,

    #[serde(rename = "ean")]
    pub ean: Option<String>,

    #[serde(rename = "email", skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

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

    #[serde(rename = "currency")]
    pub currency: String,

    #[serde(rename = "customerGroup")]
    pub group: CustomerGroup,

    #[serde(rename = "vatZone")]
    pub vat_zone: VatZone,

    #[serde(rename = "paymentTerms")]
    pub payment_terms: PaymentTerms,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomerGroup {
    #[serde(rename = "customerGroupNumber")]
    pub id: i32,
}
