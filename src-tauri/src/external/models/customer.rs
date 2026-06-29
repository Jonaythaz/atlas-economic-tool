use serde::{Deserialize, Serialize};

use super::{PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    #[serde(rename = "customerNumber")]
    pub id: i32,

    #[serde(rename = "ean", skip_serializing_if = "Option::is_none")]
    pub ean: Option<String>,

    #[serde(rename = "email", skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    #[serde(rename = "name")]
    pub name: String,

    #[serde(rename = "address", skip_serializing_if = "Option::is_none")]
    pub street: Option<String>,

    #[serde(rename = "city", skip_serializing_if = "Option::is_none")]
    pub city: Option<String>,

    #[serde(rename = "zip", skip_serializing_if = "Option::is_none")]
    pub postal_code: Option<String>,

    #[serde(rename = "country", skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,

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
