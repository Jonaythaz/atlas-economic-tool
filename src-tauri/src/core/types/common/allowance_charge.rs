use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct AllowanceCharge {
    #[serde(rename = "AllowanceChargeReason")]
    pub reason: String,

    #[serde(rename = "Amount")]
    pub amount: f64,
}
