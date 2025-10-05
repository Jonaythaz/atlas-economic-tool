use serde::Serialize;

#[derive(Serialize)]
pub struct Product {
    pub id: String,
    pub name: String,
}
