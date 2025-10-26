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

impl From<crate::core::Document> for Invoice {
    fn from(document: crate::core::Document) -> Self {
        match document {
            crate::core::Document::Invoice(invoice) => Invoice::from(invoice),
            crate::core::Document::CreditNote(credit_note) => Invoice::from(credit_note),
        }
    }
}

impl From<crate::core::Invoice> for Invoice {
    fn from(invoice: crate::core::Invoice) -> Self {
        Self {
            id: invoice.id,
            date: invoice.issue_date,
            damage_number: Some(invoice.order_reference.id),
            customer: Customer {
                id: invoice.accounting_customer_party.party.endpoint_id,
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

impl From<crate::core::CreditNote> for Invoice {
    fn from(credit_note: crate::core::CreditNote) -> Self {
        Self {
            id: credit_note.id,
            date: credit_note.issue_date,
            damage_number: Some(credit_note.order_reference.id),
            customer: Customer {
                id: credit_note.accounting_customer_party.party.endpoint_id,
                name: credit_note
                    .accounting_customer_party
                    .party
                    .party_name
                    .name
                    .clone(),
            },
            recipient: credit_note.accounting_customer_party.party.party_name.name,
            lines: credit_note
                .credit_note_lines
                .into_iter()
                .map(InvoiceLine::from)
                .collect(),
        }
    }
}
