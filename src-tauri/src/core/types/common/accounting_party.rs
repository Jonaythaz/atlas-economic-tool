use serde::Deserialize;

#[derive(Debug, Clone, Deserialize)]
pub struct AccountingParty {
    #[serde(rename = "Party")]
    pub party: Party,
}

#[derive(Debug, Clone, Deserialize)]
pub struct Party {
    #[serde(rename = "EndpointID")]
    pub endpoint_id: EndpointID,

    #[serde(rename = "PartyName")]
    pub party_name: PartyName,

    #[serde(rename = "PostalAddress")]
    pub address: Address,
}

#[derive(Debug, Clone, Deserialize)]
pub struct EndpointID {
    #[serde(rename = "@schemeID")]
    pub scheme_id: String,

    #[serde(rename = "$text")]
    pub value: String,
}

#[derive(Debug, Clone, Deserialize)]
pub struct PartyName {
    #[serde(rename = "Name")]
    pub name: String,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Deserialize)]
pub struct Address {
    #[serde(rename = "StreetName")]
    pub street: String,

    #[serde(rename = "CityName")]
    pub city: String,

    #[serde(rename = "PostalZone")]
    pub postal_code: String,

    #[serde(rename = "Country")]
    pub country: Country,
}

#[allow(dead_code)]
#[derive(Debug, Clone, Deserialize)]
pub struct Country {
    #[serde(rename = "IdentificationCode")]
    pub code: String,
}
