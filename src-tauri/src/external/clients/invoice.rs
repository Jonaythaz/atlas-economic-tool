use crate::external::{
    clients::{
        helper::{get, parse_response},
        post, MOCK_MODE,
    },
    models::{Invoice, InvoiceBookRequest, InvoiceResponse},
    ClientError, ClientResult,
};

pub async fn post_invoice(invoice: &Invoice, secret: &str, grant: &str) -> ClientResult<i32> {
    if MOCK_MODE {
        return post_invoice_mock(invoice).await;
    }

    let response = post(
        "https://restapi.e-conomic.com/invoices/drafts",
        invoice,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    parse_response::<InvoiceResponse>(response)
        .await
        .map(|response| response.id)
}

pub async fn book_invoice(
    request: &InvoiceBookRequest,
    secret: &str,
    grant: &str,
) -> ClientResult<()> {
    let response = post(
        "https://restapi.e-conomic.com/invoices/booked",
        request,
        secret,
        grant,
    )
    .await
    .map_err(ClientError::from)?;

    if response.status().is_success() {
        Ok(())
    } else {
        Err(ClientError::async_from(response).await)
    }
}

pub async fn is_invoice_booked(id: i32, secret: &str, grant: &str) -> ClientResult<bool> {
    match get(
        format!("https://restapi.e-conomic.com/invoices/booked/{id}"),
        secret,
        grant,
    )
    .await
    {
        Ok(response) if response.status() == surf::StatusCode::Ok => Ok(true),
        Ok(response) if response.status() == surf::StatusCode::NotFound => Ok(false),
        Ok(response) => Err(ClientError::async_from(response).await),
        Err(err) if err.status() == surf::StatusCode::NotFound => Ok(false),
        Err(err) => Err(err.into()),
    }
}

async fn post_invoice_mock(invoice: &Invoice) -> ClientResult<i32> {
    println!("Posting invoice to mock endpoint...");
    println!(
        "Invoice: {:?}",
        serde_json::to_string_pretty(invoice).unwrap_or_else(|_| "unparsable invoice".to_string())
    );
    Ok(1)
}
