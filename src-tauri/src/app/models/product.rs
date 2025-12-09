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