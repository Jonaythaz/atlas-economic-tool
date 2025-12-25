use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Customer {
    pub external_id: i32,
    pub name: String,
    pub group: i32,
    pub vat_zone: i32,
    pub payment_terms: i32,
}

impl TryFrom<crate::external::models::Customer> for Customer {
    type Error = String;

    fn try_from(customer: crate::external::models::Customer) -> Result<Self, Self::Error> {
        Ok(Self {
            external_id: customer
                .id
                .ok_or("Expected retrieved customer to have an id")?,
            name: customer.name,
            group: customer.group.id,
            vat_zone: customer.vat_zone.id,
            payment_terms: customer.payment_terms.id,
        })
    }
}
