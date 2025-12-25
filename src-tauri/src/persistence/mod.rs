mod connection;
mod customer;
mod product;

pub use connection::{open_connection};
pub use customer::{find_customer, insert_customer, update_customer, Customer};
pub use product::{find_product, insert_product, Product};

#[cfg(test)]
use connection::test::open_in_memory_connection;
