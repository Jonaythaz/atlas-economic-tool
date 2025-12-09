use crate::external::models::Product;
use super::{ClientError, parse_response, post, get};

pub async fn get_product(id: String, secret: &str, grant: &str) -> Result<Product, ClientError> {
    let response = get(format!("https://restapi.e-conomic.com/products/{id}"), secret, grant).await
        .map_err(ClientError::from)?;

    parse_response(response).await
}

pub async fn post_product(product: &Product, secret: &str, grant: &str) -> Result<(), ClientError> {
    let response = post("https://restapi.e-conomic.com/products", product, secret, grant).await
        .map_err(ClientError::from)?;

    parse_response(response).await
}