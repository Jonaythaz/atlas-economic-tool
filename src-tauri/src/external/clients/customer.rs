use crate::external::models::Customer;
use super::{ClientError, parse_response, post, get};

pub async fn get_customer(id: i32, secret: &str, grant: &str) -> Result<Customer, ClientError> {
    let response = get(format!("https://restapi.e-conomic.com/customers/{id}"), secret, grant).await
        .map_err(ClientError::from)?;

    parse_response(response).await
}

pub async fn post_customer(customer: &Customer, secret: &str, grant: &str) -> Result<Customer, ClientError> {
    let response = post("https://restapi.e-conomic.com/customers", customer, secret, grant).await
        .map_err(ClientError::from)?;

    parse_response(response).await
}

