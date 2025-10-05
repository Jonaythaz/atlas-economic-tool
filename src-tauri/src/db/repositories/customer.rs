use rusqlite::{Connection, Statement};

use crate::{
    db::entities::CustomerEntity,
    external::{Customer, Customers},
};

pub fn update_customers(
    conn: &mut Connection,
    customers: Customers,
) -> Result<(), rusqlite::Error> {
    let tx = conn.transaction()?;
    {
        let mut insert_stmt =
            tx.prepare("INSERT INTO customer (id, name, group_id) VALUES (?1, ?2, ?3)")?;
        let mut update_stmt =
            tx.prepare("UPDATE customer SET name = ?2, group_id = ?3 WHERE id = ?1")?;

        customers.into_iter().try_for_each(|customer| {
            insert_or_update_customer(&mut insert_stmt, &mut update_stmt, &customer)
        })?;
    }
    tx.commit()
}

pub fn find_customers(conn: &Connection) -> Result<Vec<CustomerEntity>, rusqlite::Error> {
    let mut stmt = conn.prepare("SELECT id, name, group_id FROM customer")?;
    let customer_iter = stmt.query_map([], |row| {
        Ok(CustomerEntity {
            id: row.get(0)?,
            name: row.get(1)?,
            group_id: row.get(2)?,
        })
    })?;

    customer_iter.collect()
}

fn insert_or_update_customer(
    insert_stmt: &mut Statement,
    update_stmt: &mut Statement,
    customer: &Customer,
) -> Result<(), rusqlite::Error> {
    match insert_stmt.execute((&customer.id, &customer.name, &customer.group.id)) {
        Ok(_) => Ok(()),
        Err(rusqlite::Error::SqliteFailure(err, _))
            if err.code == rusqlite::ErrorCode::ConstraintViolation =>
        {
            update_stmt.execute((&customer.id, &customer.name, &customer.group.id))?;
            Ok(())
        }
        Err(e) => Err(e),
    }
}

#[cfg(test)]
mod test {
    use rusqlite::Connection;

    use crate::{
        db::{create_tables, repositories::customer::find_customers, update_customers},
        external::{Customer, Customers},
    };

    #[test]
    fn should_update_customers() {
        let mut conn = Connection::open_in_memory().expect("Failed to open in-memory database");
        create_tables(&conn).expect("Failed to create tables");

        let customers = Customers {
            items: vec![
                Customer::new(1, "Customer A".to_string(), 10),
                Customer::new(2, "Customer B".to_string(), 20),
            ],
        };
        let update_result = update_customers(&mut conn, customers);
        assert!(
            update_result.is_ok(),
            "Update failed: {:?}",
            update_result.err()
        );
    }

    #[test]
    fn should_overwrite_customers() {
        let mut conn = Connection::open_in_memory().expect("Failed to open in-memory database");
        create_tables(&conn).expect("Failed to create tables");

        let customers = Customers {
            items: vec![
                Customer::new(1, "Customer A".to_string(), 10),
                Customer::new(2, "Customer B".to_string(), 20),
                Customer::new(2, "Customer C".to_string(), 30),
            ],
        };

        let update_result = update_customers(&mut conn, customers);
        assert!(
            update_result.is_ok(),
            "Update failed: {:?}",
            update_result.err()
        );

        let find_result = find_customers(&conn);
        assert!(
            find_result.as_ref().is_ok_and(|customers| {
                let correct_len = customers.len() == 2;
                let has_overwritten_customer = customers
                    .iter()
                    .find(|customer| {
                        customer.id == 2 && customer.name == "Customer C" && customer.group_id == 30
                    })
                    .is_some();

                correct_len && has_overwritten_customer
            }),
            "Find failed: {:?}",
            find_result.err()
        );
    }
}
