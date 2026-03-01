use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Customer {
    pub id: i32,
    pub ean: Option<String>,
    pub name: String,
    pub street: String,
    pub city: String,
    pub postal_code: String,
    pub country: String,
    pub group: i32,
    pub vat_zone: i32,
    pub payment_terms: i32,
}

impl TryFrom<crate::external::models::Customer> for Customer {
    type Error = String;

    fn try_from(customer: crate::external::models::Customer) -> Result<Self, Self::Error> {
        Ok(Self {
            id: customer
                .id
                .ok_or("Expected retrieved customer to have an id")?,
            ean: customer.ean,
            name: customer.name,
            street: customer.street,
            city: customer.city,
            postal_code: customer.postal_code,
            country: customer.country,
            group: customer.group.id,
            vat_zone: customer.vat_zone.id,
            payment_terms: customer.payment_terms.id,
        })
    }
}
