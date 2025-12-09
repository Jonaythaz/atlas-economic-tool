use crate::app::models::Customer;
use crate::external::get_customer;

#[tauri::command]
pub async fn fetch_customer(id: i32, secret: String, grant: String) -> Result<Customer, String> {
    get_customer(id, &secret, &grant)
        .await
        .map_err(|e| e.to_string())?
        .try_into()
}