use crate::app::models::Product;
use crate::external::get_product;

#[tauri::command]
pub async fn fetch_product(id: String, secret: String, grant: String) -> Result<Product, String> {
    Ok(get_product(id, &secret, &grant)
        .await
        .map_err(|e| e.to_string())?
        .into())
}