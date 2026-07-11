pub mod models;

mod clients;

pub use clients::{
    book_invoice, get_customer, get_product, post_customer, post_invoice, post_product,
    put_customer, ClientError, ClientResult,
};
