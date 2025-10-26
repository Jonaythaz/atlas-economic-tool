use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Item {
    #[serde(rename = "Name")]
    pub name: String,

    #[serde(rename = "SellersItemIdentification")]
    pub sellers_item_identification: SellersItemIdentification,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SellersItemIdentification {
    #[serde(rename = "ID")]
    pub id: String,
}
