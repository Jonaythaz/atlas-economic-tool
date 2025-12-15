use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct AccountingParty {
    #[serde(rename = "Party")]
    pub party: Party,
}

#[derive(Debug, Deserialize)]
pub struct Party {
    #[serde(rename = "EndpointID")]
    pub endpoint_id: String,

    #[serde(rename = "PartyName")]
    pub party_name: PartyName,
}

#[derive(Debug, Deserialize)]
pub struct PartyName {
    #[serde(rename = "Name")]
    pub name: String,
}
