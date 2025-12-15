use serde::Serialize;
use std::hash::{Hash, Hasher};

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

impl Hash for DocumentProduct {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

impl PartialEq for DocumentProduct {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for DocumentProduct {}
