use tauri::State;

use crate::app::models::{Customer, NewCustomer, Tokens};
use crate::app::{AppState, DatabaseAccess};
use crate::external::{get_customer, post_customer, put_customer};
use crate::persistence::insert_customer;

#[tauri::command]
pub async fn create_customer(
    customer: NewCustomer,
    tokens: Tokens,
    state: State<'_, AppState>,
) -> Result<Customer, String> {
    let customer_id = match customer {
        NewCustomer::Business { id, .. } => id,
        NewCustomer::Private { id, .. } => id,
    };

    let customer_ean = match &customer {
        NewCustomer::Business { ean, .. } => Some(ean.clone()),
        _ => None,
    };

    let external_customer = match fetch_existing_customer(customer_id, &tokens).await? {
        Some(mut existing) => {
            let mut is_dirty = false;
            if existing.city.is_none() {
                is_dirty = true;
                let _ = existing.city.insert(match &customer {
                    NewCustomer::Business { city, .. } => city.clone(),
                    NewCustomer::Private { city, .. } => city.clone(),
                });
            }
            if existing.street.is_none() {
                is_dirty = true;
                let _ = existing.street.insert(match &customer {
                    NewCustomer::Business { street, .. } => street.clone(),
                    NewCustomer::Private { street, .. } => street.clone(),
                });
            }
            if existing.postal_code.is_none() {
                is_dirty = true;
                let _ = existing.postal_code.insert(match &customer {
                    NewCustomer::Business { postal_code, .. } => postal_code.clone(),
                    NewCustomer::Private { postal_code, .. } => postal_code.clone(),
                });
            }
            if existing.country.is_none() {
                is_dirty = true;
                let _ = existing.country.insert(match &customer {
                    NewCustomer::Business { country, .. } => country.clone(),
                    NewCustomer::Private { country, .. } => country.clone(),
                });
            }
            if is_dirty {
                put_customer(&existing, &tokens.secret, &tokens.grant)
                    .await
                    .map_err(|err| {
                        format!("Was unable to update existing customer. Cause: {}", err)
                    })?
            } else {
                existing
            }
        }
        None => create_customer_externally(customer, &tokens).await?,
    };

    if let Some(ean) = customer_ean {
        let db_customer = crate::persistence::Customer {
            id: ean,
            external_id: external_customer.id,
        };

        state
            .db(|conn| insert_customer(conn, &db_customer))
            .unwrap_or(());
    }

    external_customer.try_into()
}

async fn fetch_existing_customer(
    customer_id: i32,
    tokens: &Tokens,
) -> Result<Option<crate::external::models::Customer>, String> {
    get_customer(customer_id, &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| format!("Was unable to fetch existing customer. Cause: {}", err))
}

async fn create_customer_externally(
    customer: NewCustomer,
    tokens: &Tokens,
) -> Result<crate::external::models::Customer, String> {
    post_customer(&customer.into(), &tokens.secret, &tokens.grant)
        .await
        .map_err(|err| format!("Was unable to create customer. Cause: {}", err))
}
