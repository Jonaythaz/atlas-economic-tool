use std::ops::Neg;

use crate::core::{
    models::Product,
    types::{CreditNoteLine, InvoiceLine},
};

pub struct DocumentLine {
    pub product: Product,
    pub price: f64,
    pub quantity: f64,
}

impl From<InvoiceLine> for DocumentLine {
    fn from(line: InvoiceLine) -> Self {
        Self {
            product: line.item.into(),
            price: line.price.price_amount,
            quantity: line.price.base_quantity,
        }
    }
}

impl From<CreditNoteLine> for DocumentLine {
    fn from(line: CreditNoteLine) -> Self {
        Self {
            product: line.item.into(),
            price: line.price.price_amount,
            quantity: line.price.base_quantity.abs().neg(),
        }
    }
}
