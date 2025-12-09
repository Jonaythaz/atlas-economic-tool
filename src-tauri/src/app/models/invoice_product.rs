use serde::Serialize;
use std::hash::{Hash, Hasher};

#[derive(Clone, Serialize)]
pub struct InvoiceProduct {
    pub id: String,
    pub name: String,
    pub group: Option<i32>,
}

impl From<crate::core::models::Item> for InvoiceProduct {
    fn from(item: crate::core::models::Item) -> Self {
        Self {
            id: item.sellers_item_identification.id,
            name: item.name,
            group: None,
        }
    }
}

impl Hash for InvoiceProduct {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

impl PartialEq for InvoiceProduct {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for InvoiceProduct {}
