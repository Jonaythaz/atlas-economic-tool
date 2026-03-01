use serde::Serialize;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentCustomer {
    pub ean: String,
    pub name: String,
    pub street: String,
    pub city: String,
    pub postal_code: String,
    pub country: String,
}

impl From<crate::core::models::AccountingParty> for DocumentCustomer {
    fn from(party: crate::core::models::AccountingParty) -> Self {
        Self {
            ean: party.party.endpoint_id,
            name: party.party.party_name.name,
            street: party.party.address.street,
            city: party.party.address.city,
            postal_code: party.party.address.postal_code,
            country: country_code_to_name(party.party.address.country.code),
        }
    }
}

fn country_code_to_name(code: String) -> String {
    match code.as_str() {
        "DK" => "Danmark".to_string(),
        _ => code,
    }
}
