use crate::external::{
    clients::{helper::post, parse_error},
    models::Invoice,
    ClientError, Tokens,
};

pub async fn create_invoice(invoice: &Invoice, tokens: &Tokens) -> Result<(), ClientError> {
    let response = post(
        "https://restapi.e-conomic.com/invoices/drafts",
        invoice,
        &tokens.secret,
        &tokens.grant,
    )
    .await
    .map_err(ClientError::from)?;

    if response.status().is_success() {
        return Ok(());
    }
    Err(parse_error(response).await)
}
