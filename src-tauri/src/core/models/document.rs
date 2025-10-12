use serde::{Deserialize, Serialize};
use super::{Invoice, CreditNote};

#[derive(Debug, Serialize, Deserialize)]
pub enum Document {
    Invoice(Invoice),
    CreditNote(CreditNote),
}
