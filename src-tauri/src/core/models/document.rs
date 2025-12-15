use super::{CreditNote, Invoice};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub enum Document {
    Invoice(Invoice),
    CreditNote(CreditNote),
}
