pub mod models;

mod clients;

pub use clients::{
    get_customer, get_product, post_customer, post_invoice, post_product, ClientError, ClientResult,
};
