use tauri::State;

use crate::app::models::{CreateCustomerRequest, NewCustomer, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::post_customer;
use crate::persistence::{find_customer, insert_customer};

#[tauri::command]
pub async fn create_customer(
    request: CreateCustomerRequest,
    state: State<'_, AppState>,
) -> Result<i32, String> {
    if let Some(id) = find_customer_locally(&request.customer.ean, &state)? {
        return Ok(id);
    }

    let ean = request.customer.ean.clone();
    let id = create_customer_externally(request.customer, request.tokens).await?;
    create_customer_locally(ean, id, &state)?;

    Ok(id)
}

fn find_customer_locally(id: &str, state: &State<'_, AppState>) -> Result<Option<i32>, String> {
    state
        .db(|conn| find_customer(conn, id))
        .map(|customer| customer.map(|c| c.external_id))
        .map_err(|error| error.to_string())
}

async fn create_customer_externally(
    new_customer: NewCustomer,
    tokens: Tokens,
) -> Result<i32, String> {
    let external_customer = new_customer.into();
    post_customer(&external_customer, &tokens.secret, &tokens.grant)
        .await
        .map(|created_customer| created_customer.id)
        .map_err(|error| error.to_string())?
        .ok_or("The customer wasn't correctly created".to_string())
}

fn create_customer_locally(
    id: String,
    external_id: i32,
    state: &State<'_, AppState>,
) -> Result<(), String> {
    let db_customer = crate::persistence::Customer { id, external_id };
    state
        .db(|conn| insert_customer(conn, &db_customer))
        .map_err(|error| error.to_string())
}
