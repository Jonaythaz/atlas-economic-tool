use serde::Serialize;

use crate::core::models::DocumentCustomer;

#[derive(Clone, Serialize)]
#[serde(rename_all = "kebab-case", tag = "type")]
pub enum CustomerReference {
    Private { cpr: String },
    Business { ean: String },
}

impl From<DocumentCustomer> for CustomerReference {
    fn from(value: DocumentCustomer) -> Self {
        match value {
            DocumentCustomer::Private { cpr, .. } => Self::Private { cpr },
            DocumentCustomer::Business { ean, .. } => Self::Business { ean },
        }
    }
}
