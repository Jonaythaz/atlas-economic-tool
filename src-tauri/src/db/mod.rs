mod entities;
mod repositories;

pub use entities::create_tables;
pub use repositories::{update_customers, update_products};

fn open_connection() -> Result<rusqlite::Connection, rusqlite::Error> {
    rusqlite::Connection::open_in_memory()
}
