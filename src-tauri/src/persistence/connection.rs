use std::path::PathBuf;

use rusqlite_migration::{Migrations, M};

const MIGRATIONS_SLICE: &[M<'_>] = &[
    M::up("CREATE TABLE customer(id TEXT PRIMARY KEY, external_id INTEGER NOT NULL);"),
    M::up(
        "CREATE TABLE product(id TEXT PRIMARY KEY, name TEXT NOT NULL, group_id INTEGER NOT NULL);",
    ),
];

const MIGRATIONS: Migrations<'_> = Migrations::from_slice(MIGRATIONS_SLICE);

#[derive(Debug)]
pub enum ConnectionError {
    DatabaseError(rusqlite::Error),
    MigrationError(rusqlite_migration::Error),
}

pub fn open_connection(data_directory: &PathBuf) -> Result<rusqlite::Connection, ConnectionError> {
    rusqlite::Connection::open(data_directory.join("db.sqlite"))
        .map_err(|error| ConnectionError::DatabaseError(error))
        .and_then(|connection| prepare_connection(connection))
}

fn prepare_connection(
    mut connection: rusqlite::Connection,
) -> Result<rusqlite::Connection, ConnectionError> {
    connection
        .pragma_update_and_check(None, "journal_mode", "WAL", |_| Ok(()))
        .map_err(|error| ConnectionError::DatabaseError(error))?;

    MIGRATIONS
        .to_latest(&mut connection)
        .map_err(|error| ConnectionError::MigrationError(error))?;

    Ok(connection)
}

impl std::fmt::Display for ConnectionError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ConnectionError::DatabaseError(error) => {
                write!(f, "Error occured while configurating database: {}", error)
            }
            ConnectionError::MigrationError(error) => {
                write!(f, "Error occured while migrating database: {}", error)
            }
        }
    }
}

#[cfg(test)]
pub mod test {
    use super::*;

    pub fn open_in_memory_connection() -> rusqlite::Connection {
        rusqlite::Connection::open_in_memory()
            .map_err(|error| ConnectionError::DatabaseError(error))
            .and_then(|connection| prepare_connection(connection))
            .expect("failed to open in-memory connection for tests")
    }
}
