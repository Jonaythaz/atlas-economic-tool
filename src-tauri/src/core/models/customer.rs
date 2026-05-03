use crate::core::types::CSVCustomer;

pub struct Customer {
    pub id: i32,
    pub cpr: String,
    pub email: String,
}

impl From<CSVCustomer> for Customer {
    fn from(customer: CSVCustomer) -> Self {
        Self {
            id: customer.id,
            cpr: customer.cpr,
            email: customer.email,
        }
    }
}
