use super::{get, parse_response, post, ClientError};
use crate::external::{clients::MOCK_MODE, models::Product, ClientResult};

pub async fn get_product(id: &str, secret: &str, grant: &str) -> ClientResult<Option<Product>> {
    if MOCK_MODE {
        return get_product_mock(id).await;
    }

    match get(
        format!("https://restapi.e-conomic.com/products/{id}"),
        secret,
        grant,
    )
    .await
    {
        Ok(response) if response.status() == surf::StatusCode::Ok => {
            parse_response(response).await.map(Some)
        }
        Ok(response) if response.status() == surf::StatusCode::NotFound => Ok(None),
        Ok(response) => Err(ClientError::async_from(response).await),
        Err(err) if err.status() == surf::StatusCode::NotFound => Ok(None),
        Err(err) => Err(err.into()),
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
