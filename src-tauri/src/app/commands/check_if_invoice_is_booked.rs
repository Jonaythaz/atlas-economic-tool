use std::time::{SystemTime, UNIX_EPOCH};

use tauri::State;

use crate::{
    app::{models::Tokens, AppState, DatabaseAccess},
    persistence::{find_invoice_status, upsert_invoice_status},
};

#[tauri::command]
pub async fn check_if_invoice_is_booked(
    id: i32,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<bool, String> {
    let now = unix_timestamp()?;
    if let Some(is_booked) = state
        .db(|conn| find_invoice_status(conn, id, now))
        .map_err(|error| error.to_string())?
    {
        return Ok(is_booked);
    }

    let is_booked = crate::external::is_invoice_booked(id, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| err.to_string())?;
    state
        .db(|conn| upsert_invoice_status(conn, id, is_booked, now))
        .map_err(|error| error.to_string())?;
    Ok(is_booked)
}

fn unix_timestamp() -> Result<i64, String> {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_secs() as i64)
        .map_err(|error| format!("System clock is before the Unix epoch: {error}"))
}
