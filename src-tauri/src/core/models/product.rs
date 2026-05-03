use crate::core::types::Item;

pub struct Product {
    pub id: String,
    pub name: String,
    pub description: String,
}

impl From<Item> for Product {
    fn from(value: Item) -> Self {
        Self {
            id: value.sellers_item_identification.id,
            name: value.name,
            description: value.description,
        }
    }
}
