use serde::Deserialize;

use crate::app::models::{NewCustomer, Tokens};

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateCustomerRequest {
    pub customer: NewCustomer,
    pub tokens: Tokens,
}
