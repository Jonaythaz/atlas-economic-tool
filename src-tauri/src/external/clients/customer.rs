use super::{get, parse_response, post, ClientError};
use crate::external::{clients::MOCK_MODE, models::Customer, ClientResult};

pub async fn get_customer(id: i32, secret: &str, grant: &str) -> ClientResult<Option<Customer>> {
    if MOCK_MODE {
        return get_customer_mock(id).await;
    }

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
    if MOCK_MODE {
        return post_customer_mock(customer).await;
    }

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
    if MOCK_MODE {
        return put_customer_mock(customer).await;
    }

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

async fn get_customer_mock(id: i32) -> ClientResult<Option<Customer>> {
    println!("Getting customer from mock endpoint...");
    println!("Customer id: {id}");
    Ok(None)
}

async fn post_customer_mock(customer: &Customer) -> ClientResult<Customer> {
    println!("Posting customer to mock endpoint...");
    println!(
        "Customer: {}",
        serde_json::to_string_pretty(customer)
            .unwrap_or_else(|_| "unparsable customer".to_string())
    );
    Ok(customer.clone())
}

async fn put_customer_mock(customer: &Customer) -> ClientResult<Customer> {
    println!("Putting customer to mock endpoint...");
    println!(
        "Customer: {}",
        serde_json::to_string_pretty(customer)
            .unwrap_or_else(|_| "unparsable customer".to_string())
    );
    Ok(customer.clone())
}
