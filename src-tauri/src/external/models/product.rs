use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Product {
    #[serde(rename = "productNumber")]
    pub id: String,
    #[serde(rename = "name")]
    pub name: String,
    #[serde(rename = "productGroup")]
    pub group: ProductGroup,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProductGroup {
    #[serde(rename = "productGroupNumber")]
    pub id: i32,
}
