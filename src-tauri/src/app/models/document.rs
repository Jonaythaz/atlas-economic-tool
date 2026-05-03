use serde::Serialize;

use crate::app::models::CustomerReference;

use super::DocumentLine;

#[derive(Serialize)]
#[serde(tag = "type", rename_all = "kebab-case")]
pub enum Document {
    #[serde(rename_all = "camelCase")]
    Invoice {
        id: String,
        damage_number: Option<String>,
        date: String,
        customer: CustomerReference,
        lines: Vec<DocumentLine>,
    },
    #[serde(rename_all = "camelCase")]
    CreditNote {
        id: String,
        invoice_id: String,
        damage_number: Option<String>,
        date: String,
        customer: CustomerReference,
        lines: Vec<DocumentLine>,
    },
}

impl From<crate::core::models::Document> for Document {
    fn from(document: crate::core::models::Document) -> Self {
        match document {
            crate::core::models::Document::Invoice {
                id,
                damage_number,
                date,
                customer,
                lines,
            } => Document::Invoice {
                id,
                damage_number,
                date,
                customer: customer.into(),
                lines: lines.into_iter().map(DocumentLine::from).collect(),
            },
            crate::core::models::Document::CreditNote {
                id,
                invoice_id,
                damage_number,
                date,
                customer,
                lines,
            } => Document::CreditNote {
                id,
                invoice_id,
                damage_number,
                date,
                customer: customer.into(),
                lines: lines.into_iter().map(DocumentLine::from).collect(),
            },
        }
    }
}
