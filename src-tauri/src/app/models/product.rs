use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub group: i32,
}

impl From<crate::external::models::Product> for Product {
    fn from(product: crate::external::models::Product) -> Self {
        Self {
            id: product.id,
            name: product.name,
            group: product.group.id,
        }
    }
}

impl From<crate::persistence::Product> for Product {
    fn from(product: crate::persistence::Product) -> Self {
        Self {
            id: product.id,
            name: product.name,
            group: product.group_id,
        }
    }
}

impl Into<crate::persistence::Product> for Product {
    fn into(self) -> crate::persistence::Product {
        crate::persistence::Product {
            id: self.id,
            name: self.name,
            group_id: self.group,
        }
    }
}
