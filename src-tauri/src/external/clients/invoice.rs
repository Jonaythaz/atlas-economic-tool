use crate::external::{clients::{helper::ClientError, post}, models::Invoice};

pub async fn post_invoice(invoice: &Invoice, secret: &str, grant: &str) -> Result<(), ClientError> {
    let response = post("https://restapi.e-conomic.com/invoices/drafts", invoice, secret, grant).await
        .map_err(ClientError::from)?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(ClientError::async_from(response).await)
    }
}