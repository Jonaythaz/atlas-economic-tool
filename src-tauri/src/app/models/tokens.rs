use serde::Deserialize;

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Tokens {
    pub secret: String,
    pub grant: String,
}
