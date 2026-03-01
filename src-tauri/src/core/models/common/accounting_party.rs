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

    #[serde(rename = "PostalAddress")]
    pub address: Address,
}

#[derive(Debug, Deserialize)]
pub struct PartyName {
    #[serde(rename = "Name")]
    pub name: String,
}

#[derive(Debug, Deserialize)]
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

#[derive(Debug, Deserialize)]
pub struct Country {
    #[serde(rename = "IdentificationCode")]
    pub code: String,
}
