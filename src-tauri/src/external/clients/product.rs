use super::{get, parse_response, post, ClientError};
use crate::external::{models::Product, ClientResult};

pub async fn get_product(id: &str, secret: &str, grant: &str) -> ClientResult<Option<Product>> {
    let response = get(
        format!("https://restapi.e-conomic.com/products/{id}"),
        secret,
        grant,
    )
    .await
    .and_then(|res| match res.status() {
        surf::StatusCode::Ok => Ok(Some(res)),
        surf::StatusCode::NotFound => Ok(None),
        _ => Err(surf::Error::from_str(res.status(), "Failed to get product")),
    });

    match response {
        Ok(Some(res)) => parse_response(res).await.map(|body| Some(body)),
        Ok(None) => Ok(None),
        Err(error) => {
            println!("status code: {:?}", error.status());
            if error.status() == surf::StatusCode::NotFound {
                Ok(None)
            } else {
                Err(error.into())
            }
        }
    }
}

pub async fn post_product(product: &Product, secret: &str, grant: &str) -> ClientResult<Product> {
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
