use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct DocumentProduct {
    pub id: String,
    pub name: String,
}

impl From<crate::core::models::Item> for DocumentProduct {
    fn from(item: crate::core::models::Item) -> Self {
        Self {
            id: item.sellers_item_identification.id,
            name: item.name,
        }
    }
}
