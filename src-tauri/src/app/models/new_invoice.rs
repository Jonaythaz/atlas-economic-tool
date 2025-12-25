use serde::Deserialize;

use crate::app::models::NewInvoiceLine;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewInvoice {
    pub date: String,
    pub layout: i32,
    pub customer: i32,
    pub recipient: String,
    pub payment_terms: i32,
    pub vat_zone: i32,
    pub damage_number: Option<String>,
    pub lines: Vec<NewInvoiceLine>,
}

impl Into<crate::external::models::Invoice> for NewInvoice {
    fn into(self) -> crate::external::models::Invoice {
        crate::external::models::Invoice::new(
            self.date,
            self.layout,
            self.customer,
            self.recipient,
            self.payment_terms,
            self.vat_zone,
            self.damage_number,
            self.lines.into_iter().map(|line| line.into()).collect(),
        )
    }
}
