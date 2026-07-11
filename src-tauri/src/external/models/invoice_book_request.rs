use serde::Serialize;

#[derive(Serialize)]
pub struct InvoiceBookRequest {
    #[serde(rename = "draftInvoice")]
    draft_invoice: DraftInvoice,

    #[serde(rename = "bookWithNumber")]
    id: i32,

    #[serde(rename = "sendBy")]
    send_by: SendBy,
}

#[derive(Serialize)]
struct DraftInvoice {
    #[serde(rename = "draftInvoiceNumber")]
    id: i32,
}

#[derive(Serialize)]
pub enum SendBy {
    #[serde(rename = "ean")]
    Ean,

    #[serde(rename = "Email")]
    Email,
}

impl InvoiceBookRequest {
    pub fn new(draft_id: i32, invoice_id: i32, send_by: SendBy) -> Self {
        Self {
            draft_invoice: DraftInvoice { id: draft_id },
            id: invoice_id,
            send_by,
        }
    }
}
