use rusqlite::{Connection, OptionalExtension, Result, Row};
use std::convert::TryFrom;

#[derive(Debug, PartialEq, Eq)]
pub struct Customer {
    pub id: String,
    pub external_id: i32,
}

pub fn find_customer(conn: &Connection, id: &str) -> Result<Option<Customer>> {
    conn.query_row(
        "SELECT id, external_id FROM customer WHERE id = ?1",
        [id],
        |row| Customer::try_from(row),
    )
    .optional()
}

pub fn insert_customer(conn: &Connection, customer: &Customer) -> Result<()> {
    conn.execute(
        "INSERT INTO customer(id, external_id) VALUES (?1, ?2)",
        rusqlite::params![&customer.id, customer.external_id],
    )
    .map(|_| ())
}

pub fn update_customer(conn: &Connection, customer: &Customer) -> Result<bool> {
    conn.execute(
        "UPDATE customer SET external_id = ?1 WHERE id = ?2",
        rusqlite::params![customer.external_id, &customer.id],
    )
    .map(|changed| changed > 0)
}

impl TryFrom<&Row<'_>> for Customer {
    type Error = rusqlite::Error;

    fn try_from(row: &Row) -> Result<Self, Self::Error> {
        Ok(Customer {
            id: row.get(0)?,
            external_id: row.get(1)?,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::persistence::open_in_memory_connection;

    #[test]
    fn find_customer_returns_none_when_missing() {
        let conn = open_in_memory_connection();
        let res = find_customer(&conn, "non-existent").expect("query");
        assert!(res.is_none());
    }

    #[test]
    fn insert_customer_returns_row() {
        let conn = open_in_memory_connection();
        let customer = Customer {
            id: "cust-1".into(),
            external_id: 42,
        };
        insert_customer(&conn, &customer).expect("insert");

        let res = find_customer(&conn, "cust-1").expect("query");
        assert_eq!(res, Some(customer));
    }

    #[test]
    fn update_customer_updates_row() {
        let conn = open_in_memory_connection();
        let mut customer = Customer {
            id: "cust-1".into(),
            external_id: 42,
        };
        insert_customer(&conn, &customer).expect("insert");

        customer.external_id = 100;
        let updated = update_customer(&conn, &customer).expect("update");
        assert!(updated);

        let res2 = find_customer(&conn, "cust-1").expect("query");
        assert_eq!(res2, Some(customer));
    }

    #[test]
    fn update_customer_returns_false_when_missing() {
        let conn = open_in_memory_connection();
        let missing = Customer {
            id: "does-not-exist".into(),
            external_id: 0,
        };
        let updated = update_customer(&conn, &missing).expect("update");
        assert!(!updated);
    }
}
