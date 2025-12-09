use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VatZone {
    #[serde(rename = "vatZoneNumber")]
    pub id: i32,
}
