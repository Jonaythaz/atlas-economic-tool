use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewInvoiceLine {
    pub product: String,
    pub price: f64,
    pub quantity: f64,
}

impl Into<crate::external::models::InvoiceLine> for NewInvoiceLine {
    fn into(self) -> crate::external::models::InvoiceLine {
        crate::external::models::InvoiceLine::new(self.product, self.price, self.quantity)
    }
}