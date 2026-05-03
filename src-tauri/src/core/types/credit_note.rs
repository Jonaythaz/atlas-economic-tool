use super::common::{AccountingParty, BillingReference, Item, OrderReference, Price};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct CreditNote {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "IssueDate")]
    pub issue_date: String,

    #[serde(rename = "OrderReference")]
    pub order_reference: OrderReference,

    #[serde(rename = "BillingReference")]
    pub billing_reference: BillingReference,

    #[serde(rename = "AccountingCustomerParty")]
    pub accounting_customer_party: AccountingParty,

    #[serde(rename = "CreditNoteLine")]
    pub credit_note_lines: Vec<CreditNoteLine>,
}

#[derive(Debug, Deserialize)]
pub struct CreditNoteLine {
    #[serde(rename = "Item")]
    pub item: Item,

    #[serde(rename = "Price")]
    pub price: Price,
}
