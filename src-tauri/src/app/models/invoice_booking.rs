use serde::Deserialize;

use crate::external::models::InvoiceBookRequest;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceBooking {
    invoice_id: i32,
    draft_invoice_id: i32,
    customer_type: CustomerType,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "kebab-case")]
enum CustomerType {
    Business,
    Private,
}

impl Into<InvoiceBookRequest> for InvoiceBooking {
    fn into(self) -> InvoiceBookRequest {
        let send_by = match self.customer_type {
            CustomerType::Business => crate::external::models::SendBy::Ean,
            CustomerType::Private => crate::external::models::SendBy::Email,
        };

        InvoiceBookRequest::new(self.draft_invoice_id, self.invoice_id, send_by)
    }
}
