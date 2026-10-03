use serde::Deserialize;

use super::Pagination;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AccountingYearsResponse {
    pub collection: Vec<AccountingYear>,
    pub pagination: Pagination,
}

#[derive(Debug, Clone, Deserialize, PartialEq, Eq)]
pub struct AccountingYear {
    pub year: String,
    pub entries: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn accounting_year_response_matches_economic_schema() {
        let response: AccountingYearsResponse = serde_json::from_str(
            r#"{
                "collection": [{
                    "year": "2025/2026",
                    "entries": "https://restapi.e-conomic.com/accounting-years/2025%2F2026/entries"
                }],
                "pagination": {
                    "skipPages": 0,
                    "pageSize": 20,
                    "results": 1,
                    "resultsWithoutFilter": 1
                },
                "self": "https://restapi.e-conomic.com/accounting-years"
            }"#,
        )
        .expect("deserialize accounting years");

        assert_eq!(response.collection[0].year, "2025/2026");
        assert_eq!(
            response.collection[0].entries,
            "https://restapi.e-conomic.com/accounting-years/2025%2F2026/entries"
        );
        assert!(!response.pagination.has_more());
    }

    #[test]
    fn pagination_detects_an_additional_page() {
        let pagination = Pagination {
            skip_pages: 1,
            page_size: 20,
            results: 41,
        };
        assert!(pagination.has_more());
    }
}
