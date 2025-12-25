use serde::Deserialize;
use tauri::State;

use crate::{
    app::{AppState, DatabaseAccess},
    persistence,
};

#[tauri::command]
pub async fn update_customer(request: Request, state: State<'_, AppState>) -> Result<(), String> {
    let db_customer = persistence::Customer {
        id: request.id,
        external_id: request.external_id,
    };
    state
        .db(|conn| {
            persistence::update_customer(conn, &db_customer).and_then(|successful| {
                if successful {
                    Ok(())
                } else {
                    persistence::insert_customer(conn, &db_customer)
                }
            })
        })
        .map_err(|error| error.to_string())
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Request {
    id: String,
    external_id: i32,
}
