use super::{InvoiceCustomer, InvoiceLine};
use serde::Serialize;
use std::hash::{Hash, Hasher};


#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Invoice {
    pub id: String,

    pub date: String,

    pub damage_number: Option<String>,

    pub customer: InvoiceCustomer,

    pub recipient: String,

    pub lines: Vec<InvoiceLine>,
}

impl From<crate::core::models::Document> for Invoice {
    fn from(document: crate::core::models::Document) -> Self {
        match document {
            crate::core::models::Document::Invoice(invoice) => Invoice::from(invoice),
            crate::core::models::Document::CreditNote(credit_note) => Invoice::from(credit_note),
        }
    }
}

impl From<crate::core::models::Invoice> for Invoice {
    fn from(invoice: crate::core::models::Invoice) -> Self {
        Self {
            id: invoice.id,
            date: invoice.issue_date,
            damage_number: Some(invoice.order_reference.id),
            customer: InvoiceCustomer::from(invoice.accounting_customer_party),
            recipient: invoice.delivery.delivery_location.address.mark_attention,
            lines: invoice
                .invoice_lines
                .into_iter()
                .map(InvoiceLine::from)
                .collect(),
        }
    }
}

impl From<crate::core::models::CreditNote> for Invoice {
    fn from(credit_note: crate::core::models::CreditNote) -> Self {
        Self {
            id: credit_note.id,
            date: credit_note.issue_date,
            damage_number: Some(credit_note.order_reference.id),
            recipient: credit_note.accounting_customer_party.party.party_name.name.clone(),
            customer: InvoiceCustomer::from(credit_note.accounting_customer_party),
            lines: credit_note
                .credit_note_lines
                .into_iter()
                .map(InvoiceLine::from)
                .collect(),
        }
    }
}

impl Hash for Invoice {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.id.hash(state);
    }
}

impl PartialEq for Invoice {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for Invoice {}