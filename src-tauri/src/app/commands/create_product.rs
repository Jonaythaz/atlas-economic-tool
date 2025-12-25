use tauri::State;

use crate::app::models::{NewProduct, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::post_product;
use crate::persistence::insert_product;

#[tauri::command]
pub async fn create_product(
    product: NewProduct,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<(), String> {
    create_product_externally(product.clone(), tokens)
        .await
        .and_then(|_| create_product_locally(product, state))
}

async fn create_product_externally(product: NewProduct, tokens: Tokens) -> Result<(), String> {
    let external_product = product.into();
    post_product(&external_product, &tokens.secret, &tokens.grant)
        .await
        .map_err(|e| e.to_string())
}

fn create_product_locally(product: NewProduct, state: State<'_, AppState>) -> Result<(), String> {
    let db_product = product.into();
    state
        .db(|conn| insert_product(conn, &db_product))
        .map_err(|error| error.to_string())
}
