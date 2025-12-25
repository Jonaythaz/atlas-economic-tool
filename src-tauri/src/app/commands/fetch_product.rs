use tauri::State;

use crate::app::models::{Product, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::get_product;
use crate::persistence::{find_product, insert_product};

#[tauri::command]
pub async fn fetch_product(
    id: String,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<Option<Product>, String> {
    if let Some(product) = find_product_locally(&id, &state)? {
        return Ok(Some(product));
    }
    if let Some(product) = fetch_product_externally(id, tokens).await? {
        state
            .db(|conn| insert_product(conn, &product.clone().into()))
            .map_err(|error| error.to_string())?;
        return Ok(Some(product));
    }
    Ok(None)
}

fn find_product_locally(id: &str, state: &State<'_, AppState>) -> Result<Option<Product>, String> {
    state
        .db(|conn| find_product(conn, id))
        .map(|product| product.map(Product::from))
        .map_err(|error| error.to_string())
}

async fn fetch_product_externally(id: String, tokens: Tokens) -> Result<Option<Product>, String> {
    get_product(id, &tokens.secret, &tokens.grant)
        .await
        .map(|product| product.map(Product::from))
        .map_err(|error| error.to_string())
}
