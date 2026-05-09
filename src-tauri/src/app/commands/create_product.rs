use tauri::State;

use crate::app::models::{NewProduct, Product, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::{get_product, post_product};
use crate::persistence::{find_product, insert_product};

#[tauri::command]
pub async fn create_product(
    product: NewProduct,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<Product, String> {
    if let Some(local_product) = find_product_locally(&product.id, &state) {
        return Ok(local_product.into());
    }
    let product = match fetch_product_externally(&product.id, &tokens).await? {
        Some(existing_product) => existing_product,
        None => create_product_externally(product, &tokens).await?,
    }
    .into();

    create_product_locally(&product, &state);

    Ok(product)
}

fn find_product_locally(
    id: &str,
    state: &State<'_, AppState>,
) -> Option<crate::persistence::Product> {
    state.db(|conn| find_product(conn, id)).unwrap_or(None)
}

async fn fetch_product_externally(
    id: &str,
    tokens: &Tokens,
) -> Result<Option<crate::external::models::Product>, String> {
    get_product(id, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| format!("Was unable to fetch existing product. Cause: {err}"))
}

async fn create_product_externally(
    product: NewProduct,
    tokens: &Tokens,
) -> Result<crate::external::models::Product, String> {
    let external_product = product.into();
    post_product(&external_product, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| format!("Was unable to create product. Cause: {err}"))
}

fn create_product_locally(product: &Product, state: &State<'_, AppState>) {
    let db_product = product.clone().into();
    state
        .db(|conn| insert_product(conn, &db_product))
        .unwrap_or(())
}
