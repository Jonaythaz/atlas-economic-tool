use crate::app::models::{Customer, Tokens};
use crate::external::get_customer;

#[tauri::command]
pub async fn fetch_customer(id: i32, tokens: Tokens) -> Result<Option<Customer>, String> {
    get_customer(id, &tokens.secret, &tokens.grant)
        .await
        .map(|customer| customer.map(Customer::from))
        .map_err(|error| error.to_string())
}
