use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentCustomer {
    pub ean: String,
    pub name: String,
}

impl From<crate::core::models::AccountingParty> for DocumentCustomer {
    fn from(party: crate::core::models::AccountingParty) -> Self {
        Self {
            ean: party.party.endpoint_id,
            name: party.party.party_name.name,
        }
    }
}
