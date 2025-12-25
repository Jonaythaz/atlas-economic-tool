use crate::app::models::{Customer, Tokens};
use crate::external::get_customer;

#[tauri::command]
pub async fn fetch_customer(id: i32, tokens: Tokens) -> Result<Option<Customer>, String> {
    let customer = get_customer(id, &tokens.secret, &tokens.grant)
        .await
        .map_err(|error| error.to_string())?;

    if let Some(customer) = customer {
        return customer.try_into().map(|customer| Some(customer));
    }
    Ok(None)
}
