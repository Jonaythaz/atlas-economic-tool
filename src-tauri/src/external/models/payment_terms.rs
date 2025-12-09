use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PaymentTerms {
    #[serde(rename = "paymentTermsNumber")]
    pub id: i32,
}
