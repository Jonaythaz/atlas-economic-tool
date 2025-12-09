use super::InvoiceProduct;
use serde::Serialize;

#[derive(Clone, Serialize)]
pub struct InvoiceLine {
    pub product: InvoiceProduct,
    pub price: f64,
    pub quantity: f64,
}

impl From<crate::core::models::InvoiceLine> for InvoiceLine {
    fn from(line: crate::core::models::InvoiceLine) -> Self {
        Self {
            product: InvoiceProduct::from(line.item),
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl From<crate::core::models::CreditNoteLine> for InvoiceLine {
    fn from(line: crate::core::models::CreditNoteLine) -> Self {
        Self {
            product: InvoiceProduct::from(line.item),
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl Into<crate::external::models::InvoiceLine> for InvoiceLine {
    fn into(self) -> crate::external::models::InvoiceLine {
        crate::external::models::InvoiceLine::new(self.product.id, self.quantity, self.price)
    }
}
