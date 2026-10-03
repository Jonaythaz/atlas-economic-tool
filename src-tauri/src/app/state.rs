use rusqlite::Connection;

pub struct AppState {
    pub connection: std::sync::Mutex<Option<Connection>>,
    invoice_scan_started: std::sync::atomic::AtomicBool,
}

impl AppState {
    pub fn new(connection: Connection) -> Self {
        Self {
            connection: std::sync::Mutex::new(Some(connection)),
            invoice_scan_started: std::sync::atomic::AtomicBool::new(false),
        }
    }

    pub fn try_start_invoice_scan(&self) -> bool {
        self.invoice_scan_started
            .compare_exchange(
                false,
                true,
                std::sync::atomic::Ordering::AcqRel,
                std::sync::atomic::Ordering::Acquire,
            )
            .is_ok()
    }
}
