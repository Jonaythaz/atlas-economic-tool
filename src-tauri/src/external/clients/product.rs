use crate::external::{
    clients::{get, parse_error, parse_response, post},
    ClientError, Product, Products, Tokens,
};

pub async fn fetch_products(tokens: &Tokens) -> Result<Products, ClientError> {
    let response = get(
        "https://restapi.e-conomic.com/products",
        &tokens.secret,
        &tokens.grant,
    )
    .await?;

    parse_response(response).await
}

pub async fn create_product(product: Product, tokens: &Tokens) -> Result<(), ClientError> {
    let response = post(
        "https://restapi.e-conomic.com/products",
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
