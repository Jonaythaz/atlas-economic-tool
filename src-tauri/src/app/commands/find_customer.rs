use tauri::State;

use crate::{
    app::{AppState, DatabaseAccess},
    persistence,
};

#[tauri::command]
pub fn find_customer(id: String, state: State<'_, AppState>) -> Result<Option<i32>, String> {
    state
        .db(|conn| persistence::find_customer(conn, &id))
        .map(|customer| customer.map(|c| c.external_id))
        .map_err(|error| error.to_string())
}
