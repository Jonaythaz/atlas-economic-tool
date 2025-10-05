use rusqlite::Connection;

pub struct ProductEntity {
    pub id: String,
    pub name: String,
    pub group_id: i32,
}

pub fn create_table(conn: &Connection) -> Result<(), rusqlite::Error> {
    conn.execute(
        "
        CREATE TABLE IF NOT EXISTS product (
            id             TEXT PRIMARY KEY,
            name           TEXT NOT NULL,
            group_id       INTEGER NOT NULL
        )
    ",
        (),
    )?;

    Ok(())
}
