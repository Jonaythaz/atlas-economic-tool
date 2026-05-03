use serde::Deserialize;

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct CSVCustomer {
    #[serde(rename = "Recnum")]
    pub id: i32,

    #[serde(rename = "Cpr")]
    pub cpr: String,

    #[serde(rename = "Kaldenavn")]
    pub name: String,

    #[serde(rename = "Adresse")]
    pub street: String,

    #[serde(rename = "Postnr")]
    pub postal_code: String,

    #[serde(rename = "Email")]
    pub email: String,

    #[serde(rename = "Mobiltlf")]
    pub phone: String,

    #[serde(rename = "Adresse2")]
    pub secondary_address: Option<String>,

    #[serde(rename = "Betaler")]
    pub payer: String,

    #[serde(rename = "Bynavn")]
    pub city: String,
}
