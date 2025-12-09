mod customer;
mod helper;
mod invoice;
mod product;

pub use customer::{get_customer, post_customer};
pub use invoice::post_invoice;
pub use product::{get_product, post_product};

use helper::{ClientError, parse_response, post, get};
