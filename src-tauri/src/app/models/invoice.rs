use crate::app::models::{Customer, InvoiceLine};
use serde::Serialize;

#[derive(Serialize)]
pub struct Invoice {
    pub id: String,

    pub date: String,

    #[serde(rename = "damageNumber")]
    pub damage_number: Option<String>,

    pub customer: Customer,

    pub recipient: String,

    pub lines: Vec<InvoiceLine>,
}

impl From<crate::core::Invoice> for Invoice {
    fn from(invoice: crate::core::Invoice) -> Self {
        Self {
            id: invoice.id,
            date: invoice.issue_date,
            damage_number: Some(invoice.order_reference.id),
            customer: Customer {
                id: invoice.accounting_customer_party.party.endpoint_id.value,
                name: invoice.accounting_customer_party.party.party_name.name,
            },
            recipient: invoice.delivery.delivery_location.address.mark_attention,
            lines: invoice
                .invoice_lines
                .into_iter()
                .map(InvoiceLine::from)
                .collect(),
        }
    }
}
