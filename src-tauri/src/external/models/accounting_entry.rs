use serde::Deserialize;

use super::Pagination;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountingEntriesResponse {
    pub collection: Vec<AccountingEntry>,
    pub pagination: Pagination,
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct AccountingEntry {
    #[serde(default, deserialize_with = "deserialize_invoice_number")]
    pub invoice_number: Option<String>,
}

fn deserialize_invoice_number<'de, D>(deserializer: D) -> Result<Option<String>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    #[derive(Deserialize)]
    #[serde(untagged)]
    enum InvoiceNumber {
        String(String),
        Signed(i64),
        Unsigned(u64),
    }

    Option::<InvoiceNumber>::deserialize(deserializer).map(|number| {
        number.map(|number| match number {
            InvoiceNumber::String(number) => number,
            InvoiceNumber::Signed(number) => number.to_string(),
            InvoiceNumber::Unsigned(number) => number.to_string(),
        })
    })
}

#[derive(Debug, PartialEq, Eq)]
pub struct ManualDebtorInvoicePage {
    pub invoice_ids: Vec<i32>,
    pub entry_count: usize,
    pub page_size: u32,
    pub has_more: bool,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn entries_response_deserializes_string_invoice_numbers_and_pagination() {
        let response: AccountingEntriesResponse = serde_json::from_str(
            r#"{
                "collection": [{
                    "invoiceNumber": "12345",
                    "entryNumber": 12345,
                    "entryType": "manualDebtorInvoice",
                    "self": "https://restapi.e-conomic.com/accounting-years/2026/entries/12345"
                }],
                "pagination": {
                    "skipPages": 0,
                    "pageSize": 1000,
                    "maxPageSizeAllowed": 1000,
                    "results": 1001,
                    "resultsWithoutFilter": 5000
                },
                "self": "https://restapi.e-conomic.com/accounting-years/2026/entries"
            }"#,
        )
        .expect("deserialize accounting entries");

        assert_eq!(
            response.collection[0].invoice_number.as_deref(),
            Some("12345")
        );
        assert!(response.pagination.has_more());
    }

    #[test]
    fn entries_response_accepts_numeric_invoice_numbers_from_live_api() {
        let response: AccountingEntriesResponse = serde_json::from_str(
            r#"{
                "collection": [{
                    "invoiceNumber": 6450,
                    "entryNumber": 6450,
                    "entryType": "manualDebtorInvoice",
                    "self": "https://restapi.e-conomic.com/accounting-years/2026/entries/6450"
                }],
                "pagination": {
                    "skipPages": 0,
                    "pageSize": 1000,
                    "results": 1
                },
                "self": "https://restapi.e-conomic.com/accounting-years/2026/entries"
            }"#,
        )
        .expect("deserialize numeric invoice number");

        assert_eq!(
            response.collection[0].invoice_number.as_deref(),
            Some("6450")
        );
    }

    #[test]
    fn entries_without_invoice_number_remain_deserializable_and_unindexed() {
        let response: AccountingEntriesResponse = serde_json::from_str(
            r#"{
                "collection": [{
                    "entryNumber": 6450,
                    "entryType": "financeVoucher",
                    "self": "https://restapi.e-conomic.com/accounting-years/2026/entries/6450"
                }],
                "pagination": {
                    "skipPages": 0,
                    "pageSize": 1000,
                    "results": 1
                },
                "self": "https://restapi.e-conomic.com/accounting-years/2026/entries"
            }"#,
        )
        .expect("deserialize entry without invoice number");

        assert_eq!(response.collection[0].invoice_number, None);
        assert!(response
            .collection
            .into_iter()
            .filter_map(|entry| entry.invoice_number)
            .next()
            .is_none());
    }
}
