use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct VatZone {
    #[serde(rename = "vatZoneNumber")]
    number: i32,
}

impl Default for VatZone {
    fn default() -> Self {
        Self { number: 4 }
    }
}
