use crate::core::types::AccountingParty;

pub enum DocumentCustomer {
    Private {
        cpr: String,
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
    },
    Business {
        ean: String,
        name: String,
        street: String,
        city: String,
        postal_code: String,
        country: String,
    },
}

impl From<AccountingParty> for DocumentCustomer {
    fn from(value: AccountingParty) -> Self {
        if value.party.endpoint_id.scheme_id.eq("DK:CPR") {
            Self::Private {
                cpr: value.party.endpoint_id.value,
                name: value.party.party_name.name,
                street: value.party.address.street,
                city: value.party.address.city,
                postal_code: value.party.address.postal_code,
                country: "Danmark".to_string(),
            }
        } else {
            Self::Business {
                ean: value.party.endpoint_id.value,
                name: value.party.party_name.name,
                street: value.party.address.street,
                city: value.party.address.city,
                postal_code: value.party.address.postal_code,
                country: "Danmark".to_string(),
            }
        }
    }
}
