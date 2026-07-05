use std::ops::Neg;

use crate::core::{
    models::Product,
    types::{CreditNoteLine, InvoiceLine},
};

pub struct DocumentLine {
    pub product: Product,
    pub price: f64,
    pub quantity: f64,
    pub discount: Option<f64>,
}

impl From<InvoiceLine> for DocumentLine {
    fn from(line: InvoiceLine) -> Self {
        let discount = line
            .allowance_charge
            .and_then(|ac| ac.reason.eq_ignore_ascii_case("Rabat").then_some(ac.amount));
        Self {
            product: line.item.into(),
            price: discount.map_or(line.price.price_amount, |d| line.price.price_amount + d),
            quantity: line.price.base_quantity,
            discount,
        }
    }
}

impl From<CreditNoteLine> for DocumentLine {
    fn from(line: CreditNoteLine) -> Self {
        let discount = line
            .allowance_charge
            .and_then(|ac| ac.reason.eq_ignore_ascii_case("Rabat").then_some(ac.amount));
        Self {
            product: line.item.into(),
            price: discount.map_or(line.price.price_amount, |d| line.price.price_amount + d),
            quantity: line.price.base_quantity.abs().neg(),
            discount,
        }
    }
}
