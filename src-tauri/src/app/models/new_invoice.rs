use serde::Deserialize;

use crate::{
    app::models::{NewInvoiceLine, NewInvoiceRecipient},
    external::models::{InvoiceCustomer, InvoiceLayout, InvoiceReferences, PaymentTerms},
};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewInvoice {
    pub date: String,
    pub layout: i32,
    pub customer_id: i32,
    pub recipient: NewInvoiceRecipient,
    pub payment_terms: i32,
    pub damage_number: Option<String>,
    pub lines: Vec<NewInvoiceLine>,
}

impl Into<crate::external::models::Invoice> for NewInvoice {
    fn into(self) -> crate::external::models::Invoice {
        crate::external::models::Invoice {
            currency: "DKK".to_string(),
            customer: InvoiceCustomer {
                number: self.customer_id,
            },
            date: self.date,
            layout: InvoiceLayout {
                number: self.layout,
            },
            payment_terms: PaymentTerms {
                id: self.payment_terms,
            },
            recipient: self.recipient.into(),
            references: self.damage_number.map(|dn| InvoiceReferences { other: dn }),
            lines: self.lines.into_iter().map(NewInvoiceLine::into).collect(),
        }
    }
}
