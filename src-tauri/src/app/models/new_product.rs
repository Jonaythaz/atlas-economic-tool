use serde::Deserialize;

#[derive(Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NewProduct {
    pub id: String,
    pub name: String,
    pub group: i32,
}

impl Into<crate::external::models::Product> for NewProduct {
    fn into(self) -> crate::external::models::Product {
        crate::external::models::Product {
            id: self.id,
            name: self.name,
            group: crate::external::models::ProductGroup { id: self.group },
        }
    }
}

impl Into<crate::persistence::Product> for NewProduct {
    fn into(self) -> crate::persistence::Product {
        crate::persistence::Product {
            id: self.id,
            name: self.name,
            group_id: self.group,
        }
    }
}
