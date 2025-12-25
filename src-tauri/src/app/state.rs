use rusqlite::Connection;

pub struct AppState {
    pub connection: std::sync::Mutex<Option<Connection>>,
}

impl AppState {
    pub fn new(connection: Connection) -> Self {
        Self {
            connection: std::sync::Mutex::new(Some(connection)),
        }
    }
}
