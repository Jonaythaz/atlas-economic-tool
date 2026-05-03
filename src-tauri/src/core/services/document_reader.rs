use std::{collections::HashMap, path::PathBuf};

use crate::core::{
    models::{Documents, ReadError},
    services::data_reader,
};

pub async fn load_documents() -> Result<Documents, ReadError> {
    let dir = data_reader::pick_dir().await?;
    let data = read_files(dir)?;

    let mut customer_map = HashMap::new();
    let mut documents = Vec::new();
    for result in data {
        match result {
            DocumentResult::Document(document) => documents.push(document.into()),
            DocumentResult::Customer(customers) => customer_map.extend(
                customers
                    .into_iter()
                    .map(|customer| (customer.cpr.clone(), customer.into())),
            ),
        }
    }

    Ok(Documents {
        documents,
        customer_map,
    })
}

fn read_files(dir: PathBuf) -> Result<Vec<DocumentResult>, ReadError> {
    std::fs::read_dir(dir)?
        .into_iter()
        .filter_map(|entry| entry.ok().and_then(|e| read_file(e.path())))
        .collect()
}

fn read_file(file: PathBuf) -> Option<Result<DocumentResult, ReadError>> {
    if file
        .extension()
        .is_some_and(|s| s.eq_ignore_ascii_case("xml"))
    {
        return Some(data_reader::read_xml_data(file).map(DocumentResult::Document));
    }
    if file
        .extension()
        .is_some_and(|s| s.eq_ignore_ascii_case("csv"))
    {
        return Some(data_reader::read_csv_data(file).map(DocumentResult::Customer));
    }
    None
}

enum DocumentResult {
    Document(crate::core::types::XMLDocument),
    Customer(Vec<crate::core::types::CSVCustomer>),
}
