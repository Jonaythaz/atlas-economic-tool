use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderReference {
    #[serde(rename = "ID")]
    pub id: String,
}