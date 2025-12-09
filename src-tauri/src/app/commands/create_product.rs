use crate::app::models::NewProduct;
use crate::external::post_product;

#[tauri::command]
pub async fn create_product(product: NewProduct, secret: String, grant: String) -> Result<(), String> {
    let external_product = product.into();
    post_product(&external_product, &secret, &grant)
        .await
        .map_err(|e| e.to_string())?;

    Ok(())
}