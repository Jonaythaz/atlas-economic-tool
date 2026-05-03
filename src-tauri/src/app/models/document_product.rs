use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentProduct {
    pub id: String,
    pub name: String,
    pub description: String,
}

impl From<crate::core::models::Product> for DocumentProduct {
    fn from(product: crate::core::models::Product) -> Self {
        Self {
            id: product.id,
            name: product.name,
            description: product.description,
        }
    }
}
