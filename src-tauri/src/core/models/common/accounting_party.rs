use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountingParty {
    #[serde(rename = "Party")]
    pub party: Party,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Party {
    #[serde(rename = "EndpointID")]
    pub endpoint_id: String,

    #[serde(rename = "PartyName")]
    pub party_name: PartyName,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartyName {
    #[serde(rename = "Name")]
    pub name: String,
}
