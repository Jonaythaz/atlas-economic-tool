use crate::app::models::NewCustomer;
use crate::external::post_customer;

#[tauri::command]
pub async fn create_customer(customer: NewCustomer, secret: String, grant: String) -> Result<i32, String> {
    let external_customer = customer.into();
    let new_customer = post_customer(&external_customer, &secret, &grant)
        .await
        .map(|created_customer| created_customer.id)
        .map_err(|e| e.to_string())?;

    new_customer.ok_or("The customer wasn't correctly created".to_string())
}