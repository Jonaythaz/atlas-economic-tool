use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Price {
    #[serde(rename = "PriceAmount")]
    pub price_amount: f64,

    #[serde(rename = "BaseQuantity")]
    pub base_quantity: f64,
}
