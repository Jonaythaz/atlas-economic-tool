use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceLine {
    #[serde(rename = "product")]
    product: Product,
    #[serde(rename = "quantity")]
    quantity: f64,
    #[serde(rename = "unitNetPrice")]
    unit_net_price: f64,
    #[serde(rename = "discountPercentage")]
    discount_percentage: f64,
    #[serde(rename = "unitCostPrice")]
    unit_cost_price: f64,
    #[serde(rename = "totalNetAmount")]
    total_net_amount: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Product {
    #[serde(rename = "productNumber")]
    id: String,
}

impl InvoiceLine {
    pub fn new(product: String, quantity: f64, price: f64) -> Self {
        Self {
            product: Product { id: product },
            quantity: quantity,
            unit_net_price: price,
            discount_percentage: 0.0,
            unit_cost_price: price,
            total_net_amount: price,
        }
    }
}
