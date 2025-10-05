use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize)]
pub struct InvoiceLine {
    #[serde(rename = "accrual")]
    accrual: Accrual,
    #[serde(rename = "description")]
    description: String,
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

#[derive(Debug, Clone, Serialize)]
struct Accrual {
    #[serde(rename = "endDate")]
    end_date: String,
    #[serde(rename = "startDate")]
    start_date: String,
}

impl InvoiceLine {
    pub fn new(product_id: String, description: String, date: String, price: f64) -> Self {
        Self {
            product: Product { id: product_id },
            accrual: Accrual {
                start_date: date.clone(),
                end_date: date,
            },
            description: description,
            quantity: 1.0,
            unit_net_price: price,
            discount_percentage: 0.0,
            unit_cost_price: price,
            total_net_amount: price,
        }
    }
}
