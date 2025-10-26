use super::{CreditNote, Invoice};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum Document {
    Invoice(Invoice),
    CreditNote(CreditNote),
}
