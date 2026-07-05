use super::{get, parse_response, post, ClientError};
use crate::external::{clients::MOCK_MODE, models::Product, ClientResult};

pub async fn get_product(id: &str, secret: &str, grant: &str) -> ClientResult<Option<Product>> {
    if MOCK_MODE {
        return get_product_mock(id).await;
    }

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
    if MOCK_MODE {
        return post_product_mock(product).await;
    }

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

async fn get_product_mock(id: &str) -> ClientResult<Option<Product>> {
    println!("Getting product from mock endpoint...");
    println!("Product ID: {id}");
    Ok(None)
}

async fn post_product_mock(product: &Product) -> ClientResult<Product> {
    println!("Posting product to mock endpoint...");
    println!(
        "Product: {}",
        serde_json::to_string_pretty(product).unwrap_or_else(|_| "unparsable product".to_string())
    );
    Ok(product.clone())
}
