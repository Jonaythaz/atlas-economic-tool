mod connection;
mod customer;
mod invoice_status;
mod product;

pub use connection::open_connection;
pub use customer::{find_customer, insert_customer, Customer};
pub use invoice_status::{
    find_invoice_status, get_accounting_year_progress, get_invoice_scan_metadata,
    set_invoice_scan_metadata, store_manual_invoice_page, upsert_invoice_status,
    AccountingYearProgress, InvoiceScanMetadata,
};
pub use product::{find_product, insert_product, Product};

#[cfg(test)]
use connection::test::open_in_memory_connection;
