use std::sync::Arc;

#[derive(Debug, Clone)]
pub struct Tokens {
    pub secret: Arc<str>,
    pub grant: Arc<str>,
}
