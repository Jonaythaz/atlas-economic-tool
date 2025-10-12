use serde::{Deserialize, Serialize};
use super::common::{AccountingParty, Item, OrderReference, Price};

#[derive(Debug, Serialize, Deserialize)]
pub struct CreditNote {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "IssueDate")]
    pub issue_date: String,

    #[serde(rename = "OrderReference")]
    pub order_reference: OrderReference,

    #[serde(rename = "AccountingCustomerParty")]
    pub accounting_customer_party: AccountingParty,

    #[serde(rename = "CreditNoteLine")]
    pub credit_note_lines: Vec<CreditNoteLine>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreditNoteLine {
    #[serde(rename = "Item")]
    pub item: Item,

    #[serde(rename = "Price")]
    pub price: Price,
}
