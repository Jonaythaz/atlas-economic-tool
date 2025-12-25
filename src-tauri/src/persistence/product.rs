use rusqlite::{Connection, OptionalExtension, Result, Row};
use std::convert::TryFrom;

#[derive(Debug, PartialEq, Eq)]
pub struct Product {
    pub id: String,
    pub name: String,
    pub group_id: i32,
}

pub fn find_product(conn: &Connection, id: &str) -> Result<Option<Product>> {
    conn.query_row(
        "SELECT id, name, group_id FROM product WHERE id = ?1",
        [id],
        |row| Product::try_from(row),
    )
    .optional()
}

pub fn insert_product(conn: &Connection, product: &Product) -> Result<()> {
    conn.execute(
        "INSERT INTO product(id, name, group_id) VALUES (?1, ?2, ?3)",
        rusqlite::params![&product.id, &product.name, product.group_id],
    )
    .map(|_| ())
}

#[allow(dead_code)]
pub fn update_product(conn: &Connection, product: &Product) -> Result<bool> {
    conn.execute(
        "UPDATE product SET name = ?1, group_id = ?2 WHERE id = ?3",
        rusqlite::params![&product.name, product.group_id, &product.id],
    )
    .map(|changed| changed > 0)
}

impl TryFrom<&Row<'_>> for Product {
    type Error = rusqlite::Error;

    fn try_from(row: &Row) -> Result<Self, Self::Error> {
        Ok(Product {
            id: row.get(0)?,
            name: row.get(1)?,
            group_id: row.get(2)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::persistence::open_in_memory_connection;

    #[test]
    fn find_product_returns_none_when_missing() {
        let conn = open_in_memory_connection();
        let res = find_product(&conn, "non-existent").expect("query");
        assert!(res.is_none());
    }

    #[test]
    fn insert_product_returns_row() {
        let conn = open_in_memory_connection();
        let product = Product {
            id: "prod-1".into(),
            name: "Product 1".into(),
            group_id: 3,
        };
        insert_product(&conn, &product).expect("insert");

        let res = find_product(&conn, "prod-1").expect("query");
        assert_eq!(res, Some(product));
    }

    #[test]
    fn update_product_updates_row() {
        let conn = open_in_memory_connection();
        let mut product = Product {
            id: "prod-1".into(),
            name: "Product 1".into(),
            group_id: 3,
        };
        insert_product(&conn, &product).expect("insert");

        product.name = "Product 1 updated".into();
        product.group_id = 9;
        let updated = update_product(&conn, &product).expect("update");
        assert!(updated);

        let res2 = find_product(&conn, "prod-1").expect("query");
        assert_eq!(res2, Some(product));
    }

    #[test]
    fn update_product_returns_false_when_missing() {
        let conn = open_in_memory_connection();
        let missing = Product {
            id: "does-not-exist".into(),
            name: "Ghost".into(),
            group_id: 0,
        };
        let updated = update_product(&conn, &missing).expect("update");
        assert!(!updated);
    }
}
