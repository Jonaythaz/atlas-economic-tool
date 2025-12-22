use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewInvoiceLine {
    pub description: String,
    pub product: String,
    pub quantity: f64,
    pub price: f64,
}

impl Into<crate::external::models::InvoiceLine> for NewInvoiceLine {
    fn into(self) -> crate::external::models::InvoiceLine {
        crate::external::models::InvoiceLine::new(self.description, self.product, self.quantity, self.price)
    }
}