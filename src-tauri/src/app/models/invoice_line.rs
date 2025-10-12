use crate::app::models::Product;
use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceLine {
    pub product: Product,
    pub price: f64,
    pub quantity: f64,
}

impl From<crate::core::InvoiceLine> for InvoiceLine {
    fn from(line: crate::core::InvoiceLine) -> Self {
        Self {
            product: Product {
                id: line.item.sellers_item_identification.id,
                name: line.item.name,
            },
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl From<crate::core::CreditNoteLine> for InvoiceLine {
    fn from(line: crate::core::CreditNoteLine) -> Self {
        Self {
            product: Product {
                id: line.item.sellers_item_identification.id,
                name: line.item.name,
            },
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}
