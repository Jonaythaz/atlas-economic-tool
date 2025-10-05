use serde::Deserialize;

use crate::external::models::Product;

#[derive(Debug, Clone, Deserialize)]
pub struct Products {
    #[serde(rename = "collection")]
    pub items: Vec<Product>,
}

impl IntoIterator for Products {
    type Item = Product;
    type IntoIter = std::vec::IntoIter<Product>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}
