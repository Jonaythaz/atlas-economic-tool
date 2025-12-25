use rusqlite::Connection;
use tauri::State;

use crate::app::AppState;

pub enum DatabaseAccessError<E> {
    GuardError(String),
    ConnectionMissing,
    OperationFailed(E),
}

pub trait DatabaseAccess {
    fn db<F, T, E>(&self, operation: F) -> Result<T, DatabaseAccessError<E>>
    where
        F: FnOnce(&Connection) -> Result<T, E>;
}

impl<'a> DatabaseAccess for State<'a, AppState> {
    fn db<F, T, E>(&self, operation: F) -> Result<T, DatabaseAccessError<E>>
    where
        F: FnOnce(&Connection) -> Result<T, E>,
    {
        let connection_guard = self
            .connection
            .lock()
            .map_err(|err| DatabaseAccessError::GuardError(err.to_string()))?;

        let connection = connection_guard
            .as_ref()
            .ok_or(DatabaseAccessError::ConnectionMissing)?;

        operation(connection).map_err(|err| DatabaseAccessError::OperationFailed(err))
    }
}

impl<E> std::fmt::Display for DatabaseAccessError<E>
where
    E: std::fmt::Display,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DatabaseAccessError::GuardError(reason) => {
                write!(f, "Couldn't access database connection: {}", reason)
            }
            DatabaseAccessError::ConnectionMissing => {
                write!(f, "Couldn't find a database connection.")
            }
            DatabaseAccessError::OperationFailed(error) => {
                write!(f, "Database operation failed: {}", error)
            }
        }
    }
}
