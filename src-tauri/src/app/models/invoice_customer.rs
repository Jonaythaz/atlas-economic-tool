use serde::Serialize;
use std::hash::{Hash, Hasher};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceCustomer {
    pub id: String,
    pub name: String,
    pub group: Option<i32>,
    pub vat_zone: Option<i32>,
    pub payment_terms: Option<i32>,
}

impl From<crate::core::models::AccountingParty> for InvoiceCustomer {
    fn from(party: crate::core::models::AccountingParty) -> Self {
        Self {
            id: party.party.endpoint_id,
            name: party.party.party_name.name,
            group: None,
            vat_zone: None,
            payment_terms: None,
        }
    }
}

impl Hash for InvoiceCustomer {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

impl PartialEq for InvoiceCustomer {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for InvoiceCustomer {}
