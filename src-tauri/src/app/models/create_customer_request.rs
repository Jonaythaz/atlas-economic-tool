use serde::Deserialize;

use crate::{
    app::models::tokens::Tokens,
    external::models::{CustomerGroup, PaymentTerms, VatZone},
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCustomerRequest {
    pub local_id: String,
    pub new_customer: NewCustomer,
    pub tokens: Tokens,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewCustomer {
    pub name: String,
    pub group: i32,
    pub vat_zone: i32,
    pub payment_terms: i32,
}

impl Into<crate::external::models::Customer> for NewCustomer {
    fn into(self) -> crate::external::models::Customer {
        crate::external::models::Customer {
            id: None,
            name: self.name,
            group: CustomerGroup { id: self.group },
            vat_zone: VatZone { id: self.vat_zone },
            payment_terms: PaymentTerms {
                id: self.payment_terms,
            },
        }
    }
}
