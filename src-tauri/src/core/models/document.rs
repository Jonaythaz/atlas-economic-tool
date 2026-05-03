use crate::core::{
    models::{DocumentCustomer, DocumentLine},
    types::{CreditNote, Invoice, XMLDocument},
};

pub enum Document {
    Invoice {
        id: String,
        damage_number: Option<String>,
        date: String,
        customer: DocumentCustomer,
        lines: Vec<DocumentLine>,
    },
    CreditNote {
        id: String,
        invoice_id: String,
        damage_number: Option<String>,
        date: String,
        customer: DocumentCustomer,
        lines: Vec<DocumentLine>,
    },
}

impl From<XMLDocument> for Document {
    fn from(document: XMLDocument) -> Self {
        match document {
            XMLDocument::Invoice(invoice) => Document::from(invoice),
            XMLDocument::CreditNote(credit_note) => Document::from(credit_note),
        }
    }
}

impl From<Invoice> for Document {
    fn from(invoice: Invoice) -> Self {
        Self::Invoice {
            id: invoice.id,
            damage_number: invoice
                .order_reference
                .id
                .ne("n/a")
                .then_some(invoice.order_reference.id),
            date: invoice.issue_date,
            customer: invoice.accounting_customer_party.into(),
            lines: invoice
                .invoice_lines
                .into_iter()
                .map(DocumentLine::from)
                .collect(),
        }
    }
}

impl From<CreditNote> for Document {
    fn from(credit_note: CreditNote) -> Self {
        Self::CreditNote {
            id: credit_note.id,
            invoice_id: credit_note.billing_reference.invoice_reference.id,
            damage_number: credit_note
                .order_reference
                .id
                .ne("n/a")
                .then_some(credit_note.order_reference.id),
            date: credit_note.issue_date,
            customer: credit_note.accounting_customer_party.into(),
            lines: credit_note
                .credit_note_lines
                .into_iter()
                .map(DocumentLine::from)
                .collect(),
        }
    }
}
