use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Delivery {
    #[serde(rename = "DeliveryLocation")]
    pub delivery_location: DeliveryLocation,
}

#[derive(Debug, Deserialize)]
pub struct DeliveryLocation {
    #[serde(rename = "Address")]
    pub address: Address,
}

#[derive(Debug, Deserialize)]
pub struct Address {
    #[serde(rename = "MarkAttention")]
    pub mark_attention: String,
}
