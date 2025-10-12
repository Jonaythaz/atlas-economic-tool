use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Delivery {
    #[serde(rename = "DeliveryLocation")]
    pub delivery_location: DeliveryLocation,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeliveryLocation {
    #[serde(rename = "Address")]
    pub address: Address,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Address {
    #[serde(rename = "MarkAttention")]
    pub mark_attention: String,
}
