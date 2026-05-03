use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "kebab-case", tag = "type")]
pub enum Customer {
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
    #[serde(rename_all = "camelCase")]
    Private {
        id: i32,
        email: Option<String>,
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

impl From<crate::external::models::Customer> for Customer {
    fn from(customer: crate::external::models::Customer) -> Self {
        if let Some(ean) = customer.ean {
            Self::Business {
                id: customer.id,
                ean,
                name: customer.name,
                street: customer.street,
                city: customer.city,
                postal_code: customer.postal_code,
                country: customer.country,
                group: customer.group.id,
                vat_zone: customer.vat_zone.id,
                payment_terms: customer.payment_terms.id,
            }
        } else {
            Self::Private {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                street: customer.street,
                city: customer.city,
                postal_code: customer.postal_code,
                country: customer.country,
                group: customer.group.id,
                vat_zone: customer.vat_zone.id,
                payment_terms: customer.payment_terms.id,
            }
        }
    }
}
