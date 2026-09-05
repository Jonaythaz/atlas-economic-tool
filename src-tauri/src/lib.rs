mod app;
mod core;
mod external;
mod persistence;

use std::fs::create_dir_all;

use app::commands::{
    book_invoice, check_if_invoice_is_booked, create_customer, create_invoice, create_product,
    fetch_product, load_documents,
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
            book_invoice,
            check_if_invoice_is_booked,
            create_customer,
            create_invoice,
            create_product,
            fetch_product,
            load_documents,
        ])
        .setup(|app| {
            let data_directory = app.path().app_data_dir()?;
            create_dir_all(&data_directory)?;
            let connection = open_connection(&data_directory).map_err(|error| error.to_string())?;
            app.manage(AppState::new(connection));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
