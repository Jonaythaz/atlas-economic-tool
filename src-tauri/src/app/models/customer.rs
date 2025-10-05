use serde::Serialize;

#[derive(Serialize)]
pub struct Customer {
    pub id: String,
    pub name: String,
}
