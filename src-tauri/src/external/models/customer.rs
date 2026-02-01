use serde::{Deserialize, Serialize};

use super::{PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    #[serde(rename = "customerNumber", skip_serializing)]
    pub id: Option<i32>,

    #[serde(rename = "ean")]
    pub ean: Option<String>,

    #[serde(rename = "name")]
    pub name: String,

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
