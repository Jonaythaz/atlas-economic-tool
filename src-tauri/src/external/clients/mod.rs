mod customer;
mod helper;
mod invoice;
mod product;

pub use customer::{get_customer, post_customer, put_customer};
pub use helper::{ClientError, ClientResult};
pub use invoice::{book_invoice, post_invoice};
pub use product::{get_product, post_product};

use helper::{get, parse_response, post};

const MOCK_MODE: bool = false;
