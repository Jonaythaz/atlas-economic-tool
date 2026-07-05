use crate::external::{
    clients::{post, MOCK_MODE},
    models::Invoice,
    ClientError, ClientResult,
};

pub async fn post_invoice(invoice: &Invoice, secret: &str, grant: &str) -> ClientResult<()> {
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

    if response.status().is_success() {
        Ok(())
    } else {
        Err(ClientError::async_from(response).await)
    }
}

async fn post_invoice_mock(invoice: &Invoice) -> ClientResult<()> {
    println!("Posting invoice to mock endpoint...");
    println!(
        "Invoice: {:?}",
        serde_json::to_string_pretty(invoice).unwrap_or_else(|_| "unparsable invoice".to_string())
    );
    Ok(())
}
