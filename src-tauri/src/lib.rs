mod app;
mod core;
mod db;
mod external;

mod updater;

use updater::update;
use app::load_invoices;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![load_invoices])
        .setup(|app| {
            let app_handle = app.handle();
            update(app_handle.clone());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}