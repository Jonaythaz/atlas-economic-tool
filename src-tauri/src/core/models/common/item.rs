use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Item {
    #[serde(rename = "Name")]
    pub name: String,

    #[serde(rename = "Description")]
    pub description: String,

    #[serde(rename = "SellersItemIdentification")]
    pub sellers_item_identification: SellersItemIdentification,
}

#[derive(Debug, Deserialize)]
pub struct SellersItemIdentification {
    #[serde(rename = "ID")]
    pub id: String,
}
