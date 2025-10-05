use serde::{Deserialize, Serialize};

use crate::external::models::{PaymentTerms, VatZone};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Customer {
    #[serde(rename = "customerNumber")]
    pub id: i32,

    #[serde(rename = "name")]
    pub name: String,

    #[serde(rename = "customerGroup")]
    pub group: CustomerGroup,

    #[serde(rename = "vatZone", skip_deserializing)]
    vat_zone: Option<VatZone>,

    #[serde(rename = "paymentTerms", skip_deserializing)]
    payment_terms: Option<PaymentTerms>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CustomerGroup {
    #[serde(rename = "customerGroupNumber")]
    pub id: i32,
}

impl Customer {
    pub fn new(id: i32, name: String, group_id: i32) -> Self {
        Self {
            id,
            name,
            group: CustomerGroup { id: group_id },
            vat_zone: Some(VatZone::default()),
            payment_terms: Some(PaymentTerms::default()),
        }
    }
}
