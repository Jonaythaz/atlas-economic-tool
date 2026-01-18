use serde::Deserialize;

use super::common::{AccountingParty, Item, OrderReference, Price};

#[derive(Debug, Deserialize)]
pub struct Invoice {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "IssueDate")]
    pub issue_date: String,

    #[serde(rename = "OrderReference")]
    pub order_reference: OrderReference,

    #[serde(rename = "AccountingCustomerParty")]
    pub accounting_customer_party: AccountingParty,

    #[serde(rename = "InvoiceLine")]
    pub invoice_lines: Vec<InvoiceLine>,
}

#[derive(Debug, Deserialize)]
pub struct InvoiceLine {
    #[serde(rename = "Item")]
    pub item: Item,

    #[serde(rename = "Price")]
    pub price: Price,
}
