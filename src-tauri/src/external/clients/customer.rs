use crate::external::{
    clients::{get, parse_error, parse_response, post},
    ClientError, Customer, Customers, Tokens,
};

pub async fn fetch_customers(tokens: &Tokens) -> Result<Customers, ClientError> {
    let response = get(
        "https://restapi.e-conomic.com/customers",
        &tokens.secret,
        &tokens.grant,
    )
    .await?;

    parse_response(response).await
}

pub async fn create_customer(product: Customer, tokens: &Tokens) -> Result<(), ClientError> {
    let response = post(
        "https://restapi.e-conomic.com/customers",
        &product,
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
