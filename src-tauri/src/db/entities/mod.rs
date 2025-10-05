use crate::db::open_connection;

mod customer;
mod product;

pub use customer::CustomerEntity;
pub use product::ProductEntity;
use rusqlite::Connection;

pub fn create_tables(conn: &Connection) -> Result<(), rusqlite::Error> {
    customer::create_table(&conn)?;
    product::create_table(&conn)?;

    Ok(())
}
