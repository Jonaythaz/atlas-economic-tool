use crate::external::{clients::post, models::Invoice, ClientError, ClientResult};

pub async fn post_invoice(invoice: &Invoice, secret: &str, grant: &str) -> ClientResult<()> {
    let response = post(
        "https://restapi.e-conomic.com/invoices/drafts",
        invoice,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(ClientError::async_from(response).await)
    }
}
