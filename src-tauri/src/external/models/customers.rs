use serde::Deserialize;

use crate::external::models::Customer;

#[derive(Debug, Clone, Deserialize)]
pub struct Customers {
    #[serde(rename = "collection")]
    pub items: Vec<Customer>,
}

impl IntoIterator for Customers {
    type Item = Customer;
    type IntoIter = std::vec::IntoIter<Customer>;

    fn into_iter(self) -> Self::IntoIter {
        self.items.into_iter()
    }
}
