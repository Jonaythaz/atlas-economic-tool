use serde::Deserialize;

use crate::external::models::InvoiceBookRequest;

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvoiceBooking {
    invoice_id: i32,
    draft_invoice_id: i32,
    customer_type: CustomerType,
    skip_send: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "kebab-case")]
enum CustomerType {
    Business,
    Private,
}

impl Into<InvoiceBookRequest> for InvoiceBooking {
    fn into(self) -> InvoiceBookRequest {
        let send_by = match (self.skip_send, self.customer_type) {
            (false, CustomerType::Business) => crate::external::models::SendBy::Ean,
            (false, CustomerType::Private) => crate::external::models::SendBy::Email,
            (true, _) => crate::external::models::SendBy::None,
        };

        InvoiceBookRequest::new(self.draft_invoice_id, self.invoice_id, send_by)
    }
}
