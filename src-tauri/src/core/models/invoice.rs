use serde::{Deserialize, Serialize};

use super::common::{AccountingParty, Delivery, Item, OrderReference, Price};

#[derive(Debug, Serialize, Deserialize)]
pub struct Invoice {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "IssueDate")]
    pub issue_date: String,

    #[serde(rename = "OrderReference")]
    pub order_reference: OrderReference,

    #[serde(rename = "AccountingCustomerParty")]
    pub accounting_customer_party: AccountingParty,

    #[serde(rename = "Delivery")]
    pub delivery: Delivery,

    #[serde(rename = "InvoiceLine")]
    pub invoice_lines: Vec<InvoiceLine>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceLine {
    #[serde(rename = "Item")]
    pub item: Item,

    #[serde(rename = "Price")]
    pub price: Price,
}
