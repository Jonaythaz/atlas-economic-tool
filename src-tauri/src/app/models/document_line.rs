use super::DocumentProduct;
use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct DocumentLine {
    pub product: DocumentProduct,
    pub price: f64,
    pub quantity: f64,
}

impl From<crate::core::models::InvoiceLine> for DocumentLine {
    fn from(line: crate::core::models::InvoiceLine) -> Self {
        Self {
            product: DocumentProduct::from(line.item),
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl From<crate::core::models::CreditNoteLine> for DocumentLine {
    fn from(line: crate::core::models::CreditNoteLine) -> Self {
        Self {
            product: DocumentProduct::from(line.item),
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl Into<crate::external::models::InvoiceLine> for DocumentLine {
    fn into(self) -> crate::external::models::InvoiceLine {
        crate::external::models::InvoiceLine::new(self.product.id, self.quantity, self.price)
    }
}
