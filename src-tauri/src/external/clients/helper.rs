use serde::{de::DeserializeOwned, Serialize};

use crate::external::ClientError;

pub async fn get(uri: &str, secret: &str, grant: &str) -> Result<surf::Response, surf::Error> {
    surf::get(uri)
        .header("X-AppSecretToken", secret)
        .header("X-AgreementGrantToken", grant)
        .await
}

pub async fn post(
    url: &str,
    req: &impl Serialize,
    secret: &str,
    grant: &str,
) -> Result<surf::Response, surf::Error> {
    surf::post(url)
        .header("X-AppSecretToken", secret)
        .header("X-AgreementGrantToken", grant)
        .body_json(req)?
        .await
}

pub async fn parse_response<T>(mut response: surf::Response) -> Result<T, ClientError>
where
    T: DeserializeOwned,
{
    if !response.status().is_success() {
        return Err(parse_error(response).await);
    }
    response.body_json::<T>().await.map_err(ClientError::from)
}

pub async fn parse_error(mut response: surf::Response) -> ClientError {
    let error = response
        .body_json::<serde_json::Value>()
        .await
        .ok()
        .and_then(|body| serde_json::to_string_pretty(&body).ok())
        .unwrap_or(response.status().canonical_reason().to_string());

    ClientError::Response(error)
}
