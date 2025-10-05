use std::fmt::Display;

pub enum ClientError {
    Request(String),
    Response(String),
}

impl From<surf::Error> for ClientError {
    fn from(error: surf::Error) -> Self {
        Self::Request(format!("{:?}", error))
    }
}

impl Display for ClientError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ClientError::Request(s) => write!(f, "Request failed to complete: {}", s),
            ClientError::Response(s) => write!(f, "Request was unsuccessful: {}", s),
        }
    }
}
