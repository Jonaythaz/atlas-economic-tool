use std::fmt::Display;

use serde::{Serialize, de::DeserializeOwned};

pub enum ClientError {
    FailedRequest(String),
    FailedResponse(String),
}

pub async fn get(uri: impl AsRef<str>, secret: &str, grant: &str) -> Result<surf::Response, surf::Error> {
    surf::get(uri)
        .header("X-AppSecretToken", secret)
        .header("X-AgreementGrantToken", grant)
        .await
}

pub async fn post(uri: impl AsRef<str>, req: &impl Serialize, secret: &str, grant: &str) -> Result<surf::Response, surf::Error> {
    surf::post(uri)
        .header("X-AppSecretToken", secret)
        .header("X-AgreementGrantToken", grant)
        .body_json(req)?
        .await
}

pub async fn parse_response<T>(mut response: surf::Response) -> Result<T, ClientError>
where T: DeserializeOwned 
{
    if response.status().is_success() {
        if let Ok(body) = response.body_json::<T>().await {
            return Ok(body);
        }
    }
    Err(ClientError::async_from(response).await)
}

impl ClientError {
    pub async fn async_from(mut response: surf::Response) -> Self {
        let error = response.body_json::<serde_json::Value>().await.ok()
            .and_then(|body| serde_json::to_string_pretty(&body).ok())
            .unwrap_or(response.status().canonical_reason().to_string());
        ClientError::FailedResponse(error)
    }
}

impl From<surf::Error> for ClientError {
    fn from(error: surf::Error) -> Self {
        Self::FailedRequest(format!("{:?}", error))
    }
}

impl Display for ClientError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ClientError::FailedRequest(s) => write!(f, "Request failed to complete: {}", s),
            ClientError::FailedResponse(s) => write!(f, "Request was unsuccessful: {}", s),
        }
    }
}