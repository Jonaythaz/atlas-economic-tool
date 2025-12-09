mod app;
mod core;
mod external;

use app::commands::{
    create_customer, create_invoice, create_product, fetch_customer, fetch_product, load_invoices,
};

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
            load_invoices
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
