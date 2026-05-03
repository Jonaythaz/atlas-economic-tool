use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct OrderReference {
    #[serde(rename = "ID")]
    pub id: String,
}
