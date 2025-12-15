use serde::Serialize;
use std::hash::{Hash, Hasher};

use super::{DocumentCustomer, DocumentLine};

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub enum Document {
    #[serde(rename_all = "camelCase")]
    Invoice {
        id: String,
        date: String,
        damage_number: Option<String>,
        customer: DocumentCustomer,
        recipient: String,
        lines: Vec<DocumentLine>, 
    },
    #[serde(rename_all = "camelCase")]
    CreditNote {
        id: String,
        invoice_id: String,
        date: String,
        customer: DocumentCustomer,
        lines: Vec<DocumentLine>,
    }
}

impl From<crate::core::models::Document> for Document {
    fn from(document: crate::core::models::Document) -> Self {
        match document {
            crate::core::models::Document::Invoice(invoice) => Document::from(invoice),
            crate::core::models::Document::CreditNote(credit_note) => Document::from(credit_note),
        }
    }
}

impl From<crate::core::models::Invoice> for Document {
    fn from(invoice: crate::core::models::Invoice) -> Self {
        Self::Invoice {
            id: invoice.id,
            date: invoice.issue_date,
            damage_number: Some(invoice.order_reference.id),
            customer: DocumentCustomer::from(invoice.accounting_customer_party),
            recipient: invoice.delivery.delivery_location.address.mark_attention,
            lines: invoice
                .invoice_lines
                .into_iter()
                .map(DocumentLine::from)
                .collect(),
        }
    }
}

impl From<crate::core::models::CreditNote> for Document {
    fn from(credit_note: crate::core::models::CreditNote) -> Self {
        Self::CreditNote {
            id: credit_note.id,
            invoice_id: credit_note.billing_reference.invoice_reference.id,
            date: credit_note.issue_date,
            customer: DocumentCustomer::from(credit_note.accounting_customer_party),
            lines: credit_note
                .credit_note_lines
                .into_iter()
                .map(DocumentLine::from)
                .collect(),
        }
    }
}

impl Hash for Document {
    fn hash<H: Hasher>(&self, state: &mut H) {
        match self {
            Self::Invoice { id, .. } => id.hash(state),
            Self::CreditNote { id, .. } => id.hash(state),
        }
    }
}

impl PartialEq for Document {
    fn eq(&self, other: &Self) -> bool {
        match (self, other) {
            (Self::Invoice { id: self_id, .. }, Self::Invoice { id: other_id, .. }) => self_id == other_id,
            (Self::CreditNote { id: self_id, .. }, Self::CreditNote { id: other_id, .. }) => self_id == other_id,
            _ => false
        }
    }
}

impl Eq for Document {}
