use tauri::State;

use crate::app::models::{Customer, NewCustomer, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::post_customer;
use crate::persistence::insert_customer;

#[tauri::command]
pub async fn create_customer(
    customer: NewCustomer,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<Customer, String> {
    let new_customer = customer.into();

    let external_customer = post_customer(&new_customer, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| err.to_string())?;

    if let Some(ean) = new_customer.ean {
        let db_customer = crate::persistence::Customer {
            id: ean,
            external_id: external_customer.id,
        };

        state
            .db(|conn| insert_customer(conn, &db_customer))
            .unwrap_or(());
    }

    Ok(external_customer.into())
}
