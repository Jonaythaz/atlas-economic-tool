use super::{get, parse_response, post, ClientError};
use crate::external::{ClientResult, models::Product};

pub async fn get_product(id: String, secret: &str, grant: &str) -> ClientResult<Option<Product>> {
    let response = get(
        format!("https://restapi.e-conomic.com/products/{id}"),
        secret,
        grant,
    )
    .await;

    match response {
        Ok(res) => parse_response(res).await.map(|body| Some(body)),
        Err(error) => {
            if error.status() == surf::StatusCode::NotFound {
                Ok(None)
            } else {
                Err(error.into())
            }
        }
    }
}

pub async fn post_product(product: &Product, secret: &str, grant: &str) -> ClientResult<()> {
    let response = post(
        "https://restapi.e-conomic.com/products",
        product,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    parse_response(response).await
}
