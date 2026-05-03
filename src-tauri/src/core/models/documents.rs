use std::collections::HashMap;

use crate::core::models::{Customer, Document};

pub struct Documents {
    pub documents: Vec<Document>,
    pub customer_map: HashMap<String, Customer>,
}
