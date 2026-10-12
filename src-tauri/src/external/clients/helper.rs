use std::{fmt::Display, future::Future, sync::OnceLock, time::Duration};

use futures::lock::Mutex;
use serde::{de::DeserializeOwned, Serialize};

const MAX_QUEUE_RETRIES: usize = 4;
const INITIAL_RETRY_DELAY: Duration = Duration::from_millis(250);
static REQUEST_LOCK: OnceLock<Mutex<()>> = OnceLock::new();

pub enum ClientError {
    FailedRequest(String),
    FailedResponse(String),
}

pub type ClientResult<T> = Result<T, ClientError>;

pub async fn get(
    uri: impl AsRef<str>,
    secret: &str,
    grant: &str,
) -> Result<surf::Response, surf::Error> {
    let uri = uri.as_ref().to_owned();
    let secret = secret.to_owned();
    let grant = grant.to_owned();

    request_with_retry(|| {
        let request = surf::get(uri.clone())
            .header("X-AppSecretToken", &secret)
            .header("X-AgreementGrantToken", &grant);
        async move { request.await }
    })
    .await
}

pub async fn post(
    uri: impl AsRef<str>,
    req: &impl Serialize,
    secret: &str,
    grant: &str,
) -> Result<surf::Response, surf::Error> {
    let uri = uri.as_ref().to_owned();
    let secret = secret.to_owned();
    let grant = grant.to_owned();

    request_with_retry(|| {
        let request = surf::post(uri.clone())
            .header("X-AppSecretToken", &secret)
            .header("X-AgreementGrantToken", &grant)
            .body_json(req);
        async move { request?.await }
    })
    .await
}

pub async fn put(
    uri: impl AsRef<str>,
    req: &impl Serialize,
    secret: &str,
    grant: &str,
) -> Result<surf::Response, surf::Error> {
    let uri = uri.as_ref().to_owned();
    let secret = secret.to_owned();
    let grant = grant.to_owned();

    request_with_retry(|| {
        let request = surf::put(uri.clone())
            .header("X-AppSecretToken", &secret)
            .header("X-AgreementGrantToken", &grant)
            .body_json(req);
        async move { request?.await }
    })
    .await
}

async fn request_with_retry<F, Fut>(mut send: F) -> Result<surf::Response, surf::Error>
where
    F: FnMut() -> Fut,
    Fut: Future<Output = Result<surf::Response, surf::Error>>,
{
    for attempt in 0..=MAX_QUEUE_RETRIES {
        let result = {
            let _guard = REQUEST_LOCK.get_or_init(|| Mutex::new(())).lock().await;
            send().await
        };

        let response = match result {
            Ok(response) => response,
            Err(error) if error.status() == surf::StatusCode::TooManyRequests => {
                if attempt == MAX_QUEUE_RETRIES {
                    return Err(error);
                }
                async_std::task::sleep(retry_delay(attempt)).await;
                continue;
            }
            Err(error) => return Err(error),
        };

        if response.status() != surf::StatusCode::TooManyRequests || attempt == MAX_QUEUE_RETRIES {
            return Ok(response);
        }

        let retry_after = response
            .header("Retry-After")
            .and_then(|value| value.as_str().parse::<u64>().ok())
            .map(Duration::from_secs);
        drop(response);
        let delay = retry_after.unwrap_or_else(|| retry_delay(attempt));
        async_std::task::sleep(delay).await;
    }

    unreachable!("the retry loop always returns its final response")
}

fn retry_delay(attempt: usize) -> Duration {
    INITIAL_RETRY_DELAY
        .checked_mul(1_u32 << attempt)
        .unwrap_or(Duration::MAX)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn queue_retry_delay_grows_exponentially() {
        assert_eq!(retry_delay(0), Duration::from_millis(250));
        assert_eq!(retry_delay(1), Duration::from_millis(500));
        assert_eq!(retry_delay(3), Duration::from_secs(2));
    }
}

pub async fn parse_response<T>(mut response: surf::Response) -> Result<T, ClientError>
where
    T: DeserializeOwned,
{
    if !response.status().is_success() {
        return Err(ClientError::async_from(response).await);
    }

    let body = response.body_string().await.map_err(ClientError::from)?;
    serde_json::from_str(&body).map_err(|error| {
        ClientError::FailedResponse(format!(
            "Could not deserialize a successful response body: {error}"
        ))
    })
}

impl ClientError {
    pub async fn async_from(mut response: surf::Response) -> Self {
        let error = response
            .body_json::<serde_json::Value>()
            .await
            .ok()
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
