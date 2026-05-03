use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentLine {
    pub product_id: String,
    pub price: f64,
    pub quantity: f64,
}

impl From<crate::core::models::DocumentLine> for DocumentLine {
    fn from(line: crate::core::models::DocumentLine) -> Self {
        Self {
            product_id: line.product.id,
            price: line.price,
            quantity: line.quantity,
        }
    }
}
