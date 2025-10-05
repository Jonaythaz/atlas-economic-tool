use rusqlite::Connection;

use crate::external::Products;

pub fn update_products(conn: &mut Connection, products: Products) -> Result<(), rusqlite::Error> {
    let tx = conn.transaction()?;
    {
        let mut stmt =
            tx.prepare("INSERT INTO product (id, name, group_id) VALUES (?1, ?2, ?3)")?;

        products.into_iter().try_for_each(|product| {
            stmt.execute((&product.id, &product.name, &product.group.id))?;
            Ok::<(), rusqlite::Error>(())
        })?;
    }
    tx.commit()
}
