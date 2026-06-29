use super::{get, parse_response, post, ClientError};
use crate::external::{models::Customer, ClientResult};

pub async fn get_customer(id: i32, secret: &str, grant: &str) -> ClientResult<Option<Customer>> {
    let response = get(
        format!("https://restapi.e-conomic.com/customers/{id}"),
        secret,
        grant,
    )
    .await
    .and_then(|res| match res.status() {
        surf::StatusCode::Ok => Ok(Some(res)),
        surf::StatusCode::NotFound => Ok(None),
        _ => Err(surf::Error::from_str(
            res.status(),
            "Failed to get customer",
        )),
    });

    match response {
        Ok(Some(res)) => parse_response(res).await.map(|body| Some(body)),
        Ok(None) => Ok(None),
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

pub async fn put_customer(
    customer: &Customer,
    secret: &str,
    grant: &str,
) -> ClientResult<Customer> {
    let response = surf::put(format!(
        "https://restapi.e-conomic.com/customers/{}",
        customer.id
    ))
    .header("X-AppSecretToken", secret)
    .header("X-AgreementGrantToken", grant)
    .body_json(customer)
    .map_err(ClientError::from)?
    .await
    .map_err(ClientError::from)?;

    parse_response(response).await
}
