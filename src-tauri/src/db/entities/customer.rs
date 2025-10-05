use rusqlite::Connection;

pub struct CustomerEntity {
    pub id: i32,
    pub name: String,
    pub group_id: i32,
}

pub fn create_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS customer (
            id             INTEGER PRIMARY KEY,
            name           TEXT NOT NULL,
            group_id       INTEGER NOT NULL
        )
    ",
        (),
    )?;

    Ok(())
}
