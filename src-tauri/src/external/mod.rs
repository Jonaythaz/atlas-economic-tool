pub mod models;

mod clients;

pub use clients::{
    book_invoice, get_accounting_years, get_customer, get_manual_debtor_invoice_page, get_product,
    is_invoice_booked, post_customer, post_invoice, post_product, put_customer, ClientError,
    ClientResult,
};
