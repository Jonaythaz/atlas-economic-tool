use serde::Deserialize;

#[allow(dead_code)]
#[derive(Debug, Deserialize)]
pub struct CSVCustomer {
    #[serde(rename = "Recnum")]
    pub id: i32,

    #[serde(rename = "Cprnr")]
    pub cpr: String,

    #[serde(rename = "Email")]
    pub email: String,
}
