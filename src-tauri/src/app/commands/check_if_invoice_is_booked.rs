use crate::app::models::Tokens;

#[tauri::command]
pub async fn check_if_invoice_is_booked(id: i32, tokens: Tokens) -> Result<bool, String> {
    crate::external::is_invoice_booked(id, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| err.to_string())
}
