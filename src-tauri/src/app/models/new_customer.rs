use serde::Deserialize;

use crate::external::models::{CustomerGroup, PaymentTerms, VatZone};

#[derive(Clone, Deserialize)]
#[serde(rename_all = "kebab-case", tag = "type")]
pub enum NewCustomer {
    #[serde(rename_all = "camelCase")]
    Private {
        id: i32,
        email: String,
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
        group: i32,
        vat_zone: i32,
        payment_terms: i32,
    },
    #[serde(rename_all = "camelCase")]
    Business {
        id: i32,
        ean: String,
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
        group: i32,
        vat_zone: i32,
        payment_terms: i32,
    },
}

impl Into<crate::external::models::Customer> for NewCustomer {
    fn into(self) -> crate::external::models::Customer {
        match self {
            Self::Business {
                id,
                ean,
                name,
                street,
                city,
                postal_code,
                country,
                group,
                vat_zone,
                payment_terms,
            } => crate::external::models::Customer {
                id,
                ean: Some(ean),
                email: None,
                name,
                street,
                city,
                postal_code,
                country,
                group: CustomerGroup { id: group },
                vat_zone: VatZone { id: vat_zone },
                payment_terms: PaymentTerms { id: payment_terms },
            },
            Self::Private {
                id,
                email,
                name,
                street,
                city,
                postal_code,
                country,
                group,
                vat_zone,
                payment_terms,
            } => crate::external::models::Customer {
                id,
                ean: None,
                email: Some(email),
                name,
                street,
                city,
                postal_code,
                country,
                group: CustomerGroup { id: group },
                vat_zone: VatZone { id: vat_zone },
                payment_terms: PaymentTerms { id: payment_terms },
            },
        }
    }
}
