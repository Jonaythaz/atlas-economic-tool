use super::{CreditNote, Invoice};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub enum XMLDocument {
    Invoice(Invoice),
    CreditNote(CreditNote),
}
