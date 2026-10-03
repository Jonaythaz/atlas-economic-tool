use serde::Deserialize;

#[derive(Debug, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct Pagination {
    pub skip_pages: u32,
    pub page_size: u32,
    pub results: u32,
}

impl Pagination {
    pub fn has_more(&self) -> bool {
        self.skip_pages
            .saturating_add(1)
            .saturating_mul(self.page_size)
            < self.results
    }
}
