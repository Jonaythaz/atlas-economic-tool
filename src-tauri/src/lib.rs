mod app;
mod core;
mod external;
mod persistence;

use app::commands::{
    create_customer, create_invoice, create_product, fetch_customer, fetch_product, find_customer,
    load_documents, update_customer,
};
use tauri::Manager;

use crate::{app::AppState, persistence::open_connection};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(
            tauri_plugin_updater::Builder::new()
                .default_version_comparator(|current, update| update.version != current)
                .build(),
        )
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            create_customer,
            create_invoice,
            create_product,
            fetch_customer,
            fetch_product,
            find_customer,
            load_documents,
            update_customer,
        ])
        .setup(|app| {
            let data_directory = app.path().app_data_dir()?;
            let connection = open_connection(&data_directory).map_err(|error| error.to_string())?;
            app.manage(AppState::new(connection));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
