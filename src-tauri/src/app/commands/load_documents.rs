use std::collections::HashMap;

use tauri::State;

use crate::{
    app::{
        models::{Document, Documents},
        AppState, DatabaseAccess,
    },
    core::models::Customer,
    persistence::find_customer,
};

#[tauri::command]
pub async fn load_documents(state: State<'_, AppState>) -> Result<Documents, String> {
    let mut documents = crate::core::load_documents()
        .await
        .map_err(|e| e.to_string())?;

    let (private_customer_map, business_customer_map) =
        extract_customers(&documents.documents, &mut documents.customer_map, &state);
    let product_map = extract_products(&documents.documents);
    let documents = documents
        .documents
        .into_iter()
        .map(Document::from)
        .collect();

    Ok(Documents {
        documents,
        private_customer_map,
        business_customer_map,
        product_map,
    })
}

fn extract_customers(
    documents: &[crate::core::models::Document],
    customer_map: &mut std::collections::HashMap<String, Customer>,
    state: &State<'_, AppState>,
) -> (
    HashMap<String, crate::app::models::PrivateDocumentCustomer>,
    HashMap<String, crate::app::models::BusinessDocumentCustomer>,
) {
    let mut private_customer_map = HashMap::new();
    let mut business_customer_map = HashMap::new();

    let customers = documents.iter().map(|document| match document {
        crate::core::models::Document::Invoice { customer, .. } => customer,
        crate::core::models::Document::CreditNote { customer, .. } => customer,
    });

    for customer in customers {
        match customer {
            crate::core::models::DocumentCustomer::Private {
                cpr,
                name,
                street,
                city,
                postal_code,
                country,
            } => {
                if private_customer_map.contains_key(cpr) {
                    continue;
                }
                if let Some(customer) = customer_map.remove(cpr) {
                    private_customer_map.insert(
                        cpr.clone(),
                        crate::app::models::PrivateDocumentCustomer {
                            id: Some(customer.id),
                            email: Some(customer.email),
                            cpr: customer.cpr,
                            name: name.clone(),
                            street: street.clone(),
                            city: city.clone(),
                            postal_code: postal_code.clone(),
                            country: country.clone(),
                        },
                    );
                    continue;
                }
                private_customer_map.insert(
                    cpr.clone(),
                    crate::app::models::PrivateDocumentCustomer {
                        id: None,
                        email: None,
                        cpr: cpr.clone(),
                        name: name.clone(),
                        street: street.clone(),
                        city: city.clone(),
                        postal_code: postal_code.clone(),
                        country: country.clone(),
                    },
                );
            }
            crate::core::models::DocumentCustomer::Business {
                ean,
                name,
                street,
                city,
                postal_code,
                country,
            } => {
                if business_customer_map.contains_key(ean) {
                    continue;
                }
                let id = state
                    .db(|conn| find_customer(conn, ean))
                    .ok()
                    .flatten()
                    .map(|customer| customer.external_id);
                business_customer_map.insert(
                    ean.clone(),
                    crate::app::models::BusinessDocumentCustomer {
                        id,
                        ean: ean.clone(),
                        name: name.clone(),
                        street: street.clone(),
                        city: city.clone(),
                        postal_code: postal_code.clone(),
                        country: country.clone(),
                    },
                );
            }
        }
    }

    (private_customer_map, business_customer_map)
}

fn extract_products(
    documents: &[crate::core::models::Document],
) -> HashMap<String, crate::app::models::DocumentProduct> {
    let mut product_map = HashMap::new();

    let lines = documents.iter().flat_map(|document| match document {
        crate::core::models::Document::Invoice { lines, .. } => lines,
        crate::core::models::Document::CreditNote { lines, .. } => lines,
    });

    for line in lines {
        let product = &line.product;
        if product_map.contains_key(&product.id) {
            continue;
        }
        product_map.insert(
            product.id.clone(),
            crate::app::models::DocumentProduct {
                id: product.id.clone(),
                name: product.name.clone(),
                description: product.description.clone(),
            },
        );
    }

    product_map
}
