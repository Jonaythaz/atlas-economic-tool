use std::sync::Arc;

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;

#[derive(Default, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub tokens: Tokens,
}

#[derive(Default, Clone, Serialize, Deserialize)]
pub struct Tokens {
    pub secret: Arc<str>,
    pub grant: Arc<str>,
}

pub fn load_settings(app: AppHandle) -> Result<Settings, String> {
    let value = app.store("store.json")
        .map_err(|e| e.to_string())?
        .get("settings")
        .ok_or("No settings found".to_string())?;

    serde_json::from_value(value).map_err(|e| e.to_string())
}