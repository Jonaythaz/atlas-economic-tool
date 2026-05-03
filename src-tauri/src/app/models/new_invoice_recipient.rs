use serde::Deserialize;

use crate::external::models::VatZone;

#[derive(Clone, Deserialize)]
#[serde(rename_all = "kebab-case", tag = "type")]
pub enum NewInvoiceRecipient {
    #[serde(rename_all = "camelCase")]
    Business {
        ean: String,
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
        vat_zone: i32,
    },
    #[serde(rename_all = "camelCase")]
    Private {
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
        vat_zone: i32,
    },
}

impl Into<crate::external::models::InvoiceRecipient> for NewInvoiceRecipient {
    fn into(self) -> crate::external::models::InvoiceRecipient {
        match self {
            NewInvoiceRecipient::Business {
                ean,
                name,
                street,
                city,
                postal_code,
                country,
                vat_zone,
            } => crate::external::models::InvoiceRecipient {
                ean: Some(ean),
                recieval_method: Some(crate::external::models::InvoiceRecievalMethod::EAN),
                name,
                street,
                city,
                postal_code,
                country,
                vat_zone: VatZone { id: vat_zone },
            },
            NewInvoiceRecipient::Private {
                name,
                street,
                city,
                postal_code,
                country,
                vat_zone,
            } => crate::external::models::InvoiceRecipient {
                ean: None,
                recieval_method: None,
                name,
                street,
                city,
                postal_code,
                country,
                vat_zone: VatZone { id: vat_zone },
            },
        }
    }
}
