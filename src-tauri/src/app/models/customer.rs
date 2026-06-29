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

impl TryFrom<crate::external::models::Customer> for Customer {
    type Error = String;

    fn try_from(customer: crate::external::models::Customer) -> Result<Self, Self::Error> {
        if let Some(ean) = customer.ean {
            Ok(Self::Business {
                id: customer.id,
                ean,
                name: customer.name,
                street: customer
                    .street
                    .ok_or("Missing street for business customer")?,
                city: customer.city.ok_or("Missing city for business customer")?,
                postal_code: customer
                    .postal_code
                    .ok_or("Missing postal code for business customer")?,
                country: customer
                    .country
                    .ok_or("Missing country for business customer")?,
                group: customer.group.id,
                vat_zone: customer.vat_zone.id,
                payment_terms: customer.payment_terms.id,
            })
        } else {
            Ok(Self::Private {
                id: customer.id,
                email: customer.email,
                name: customer.name,
                street: customer
                    .street
                    .ok_or("Missing street for private customer")?,
                city: customer.city.ok_or("Missing city for private customer")?,
                postal_code: customer
                    .postal_code
                    .ok_or("Missing postal code for private customer")?,
                country: customer
                    .country
                    .ok_or("Missing country for private customer")?,
                group: customer.group.id,
                vat_zone: customer.vat_zone.id,
                payment_terms: customer.payment_terms.id,
            })
        }
    }
}
