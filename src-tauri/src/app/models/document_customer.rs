use serde::Serialize;
use std::hash::{Hash, Hasher};

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentCustomer {
    pub id: String,
    pub name: String,
}

impl From<crate::core::models::AccountingParty> for DocumentCustomer {
    fn from(party: crate::core::models::AccountingParty) -> Self {
        Self {
            id: party.party.endpoint_id,
            name: party.party.party_name.name,
        }
    }
}

impl Hash for DocumentCustomer {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

impl PartialEq for DocumentCustomer {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for DocumentCustomer {}
