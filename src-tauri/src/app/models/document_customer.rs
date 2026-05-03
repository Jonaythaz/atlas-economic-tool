use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BusinessDocumentCustomer {
    pub id: Option<i32>,
    pub ean: String,
    pub name: String,
    pub street: String,
    pub city: String,
    pub postal_code: String,
    pub country: String,
}

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PrivateDocumentCustomer {
    pub id: Option<i32>,
    pub email: Option<String>,
    pub cpr: String,
    pub name: String,
    pub street: String,
    pub city: String,
    pub postal_code: String,
    pub country: String,
}
