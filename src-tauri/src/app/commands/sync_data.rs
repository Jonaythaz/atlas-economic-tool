use std::sync::{Mutex, MutexGuard, PoisonError};

use crate::{
    app::AppState,
    db::{update_customers, update_products},
    external::{fetch_customers, fetch_products, ClientError, Tokens},
};

pub enum SyncError {
    StateAccess(String),
    Client(ClientError),
    Database(rusqlite::Error),
}

#[tauri::command]
pub async fn sync_data(state: tauri::State<'_, Mutex<AppState>>) -> Result<(), SyncError> {
    let mut state = state.lock()?;

    sync_customers(&mut state).await?;
    sync_products(&mut state).await?;

    Ok(())
}

async fn sync_customers(state: &mut AppState) -> Result<(), SyncError> {
    let customers = fetch_customers(&state.tokens).await?;
    update_customers(&mut state.connection, customers)?;

    Ok(())
}

async fn sync_products(state: &mut AppState) -> Result<(), SyncError> {
    let products = fetch_products(&state.tokens).await?;
    update_products(&mut state.connection, products)?;

    Ok(())
}

impl From<PoisonError<MutexGuard<'_, AppState>>> for SyncError {
    fn from(e: PoisonError<MutexGuard<'_, AppState>>) -> Self {
        SyncError::StateAccess(format!("Error accessing application state: {:?}", e))
    }
}

impl From<ClientError> for SyncError {
    fn from(e: ClientError) -> Self {
        SyncError::Client(e)
    }
}

impl From<rusqlite::Error> for SyncError {
    fn from(e: rusqlite::Error) -> Self {
        SyncError::Database(e)
    }
}
