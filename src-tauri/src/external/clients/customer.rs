use super::{get, parse_response, post, ClientError};
use crate::external::{ClientResult, models::Customer};

pub async fn get_customer(id: i32, secret: &str, grant: &str) -> ClientResult<Option<Customer>> {
    let response = get(
        format!("https://restapi.e-conomic.com/customers/{id}"),
        secret,
        grant,
    )
    .await;

    match response {
        Ok(res) => parse_response(res).await.map(|body| Some(body)),
        Err(error) => {
            if error.status() == surf::StatusCode::NotFound {
                Ok(None)
            } else {
                Err(error.into())
            }
        }
    }
}

pub async fn post_customer(
    customer: &Customer,
    secret: &str,
    grant: &str,
) -> ClientResult<Customer> {
    let response = post(
        "https://restapi.e-conomic.com/customers",
        customer,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    parse_response(response).await
}
