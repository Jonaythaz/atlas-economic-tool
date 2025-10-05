use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub struct PaymentTerms {
    #[serde(rename = "paymentTermsNumber")]
    number: i32,
}

impl Default for PaymentTerms {
    fn default() -> Self {
        Self { number: 1 }
    }
}
