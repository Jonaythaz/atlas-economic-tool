use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceLine {
    #[serde(rename = "description")]
    description: String,

    #[serde(rename = "product")]
    product: Product,

    #[serde(rename = "quantity")]
    quantity: f64,

    #[serde(rename = "discountPercentage")]
    discount_percentage: f64,

    #[serde(rename = "unitCostPrice")]
    unit_cost_price: f64,

    #[serde(rename = "unitNetPrice")]
    unit_net_price: f64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
struct Product {
    #[serde(rename = "productNumber")]
    id: String,
}

impl InvoiceLine {
    pub fn new(
        description: String,
        product: String,
        quantity: f64,
        price: f64,
        discount: Option<f64>,
    ) -> Self {
        Self {
            description,
            product: Product { id: product },
            quantity: quantity,
            discount_percentage: discount.map_or(0.0, |d| d.abs() / price.abs() * 100.0),
            unit_cost_price: price,
            unit_net_price: price - discount.unwrap_or(0.0),
        }
    }
}
