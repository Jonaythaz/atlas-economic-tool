use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename = "Invoice", rename_all = "PascalCase")]
pub struct Invoice {
    /*
    #[serde(rename = "cbc:UBLVersionID")]
    pub ubl_version_id: String,
    */

    /*
    #[serde(rename = "cbc:CustomizationID")]
    pub customization_id: String,
    */

    /*
    #[serde(rename = "cbc:ProfileID")]
    pub profile_id: ProfileId,
    */
    #[serde(rename = "cbc:ID")]
    pub id: String,

    /*
    #[serde(rename = "cbc:CopyIndicator")]
    pub copy_indicator: bool,
    */
    #[serde(rename = "cbc:IssueDate")]
    pub issue_date: String,

    /*
    #[serde(rename = "cbc:InvoiceTypeCode")]
    pub invoice_type_code: CodeType,
    */

    /*
    #[serde(rename = "cbc:DocumentCurrencyCode")]
    pub document_currency_code: String,
    */
    #[serde(rename = "cac:OrderReference")]
    pub order_reference: OrderReference,

    /*
    #[serde(rename = "cac:AdditionalDocumentReference")]
    pub additional_document_reference: AdditionalDocumentReference,
    */

    /*
    #[serde(rename = "cac:AccountingSupplierParty")]
    pub accounting_supplier_party: AccountingParty,
    */
    #[serde(rename = "cac:AccountingCustomerParty")]
    pub accounting_customer_party: AccountingParty,

    #[serde(rename = "cac:Delivery")]
    pub delivery: Delivery,

    /*
    #[serde(rename = "cac:PaymentMeans")]
    pub payment_means: Vec<PaymentMeans>,
    */

    /*
    #[serde(rename = "cac:PaymentTerms")]
    pub payment_terms: PaymentTerms,
    */

    /*
    #[serde(rename = "cac:TaxTotal")]
    pub tax_total: TaxTotal,
    */

    /*
    #[serde(rename = "cac:LegalMonetaryTotal")]
    pub legal_monetary_total: LegalMonetaryTotal,
    */
    #[serde(rename = "cac:InvoiceLine")]
    pub invoice_lines: Vec<InvoiceLine>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProfileId {
    /*
    #[serde(rename = "@schemeID")]
    pub scheme_id: String,
    */

    /*
    #[serde(rename = "@schemeAgencyID")]
    pub scheme_agency_id: String,
    */
    #[serde(rename = "#text")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CodeType {
    /*
    #[serde(rename = "@listID")]
    pub list_id: String,
    */

    /*
    #[serde(rename = "@listAgencyID")]
    pub list_agency_id: String,
    */
    #[serde(rename = "#text")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct OrderReference {
    #[serde(rename = "cbc:ID")]
    pub id: String,

    #[serde(rename = "cbc:IssueDate")]
    pub issue_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AdditionalDocumentReference {
    #[serde(rename = "cbc:ID")]
    pub id: String,

    #[serde(rename = "cbc:DocumentTypeCode")]
    pub document_type_code: CodeType,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AccountingParty {
    #[serde(rename = "cac:Party")]
    pub party: Party,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Party {
    #[serde(rename = "cbc:EndpointID")]
    pub endpoint_id: EndpointId,

    #[serde(rename = "cac:PartyName")]
    pub party_name: PartyName,
    /*
    #[serde(rename = "cac:PostalAddress")]
    pub postal_address: PostalAddress,
    */

    /*
    #[serde(rename = "cac:PartyTaxScheme")]
    pub party_tax_scheme: Option<PartyTaxScheme>,
    */

    /*
    #[serde(rename = "cac:PartyLegalEntity")]
    pub party_legal_entity: Option<PartyLegalEntity>,
    */

    /*
    #[serde(rename = "cac:Contact")]
    pub contact: Option<Contact>,
    */
}

#[derive(Debug, Serialize, Deserialize)]
pub struct EndpointId {
    /*
    #[serde(rename = "@schemeID")]
    pub scheme_id: String,
    */

    /*
    #[serde(rename = "@schemeAgencyID")]
    pub scheme_agency_id: String,
    */
    #[serde(rename = "#text")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartyName {
    #[serde(rename = "cbc:Name")]
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PostalAddress {
    #[serde(rename = "cbc:AddressFormatCode")]
    pub address_format_code: CodeType,

    #[serde(rename = "cbc:StreetName")]
    pub street_name: String,

    #[serde(rename = "cbc:CityName")]
    pub city_name: String,

    #[serde(rename = "cbc:PostalZone")]
    pub postal_zone: String,

    #[serde(rename = "cac:Country")]
    pub country: Country,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Country {
    #[serde(rename = "cbc:IdentificationCode")]
    pub identification_code: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartyTaxScheme {
    #[serde(rename = "cbc:CompanyID")]
    pub company_id: CompanyId,

    #[serde(rename = "cac:TaxScheme")]
    pub tax_scheme: TaxScheme,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompanyId {
    #[serde(rename = "@schemeID")]
    pub scheme_id: String,

    #[serde(rename = "#text")]
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxScheme {
    #[serde(rename = "cbc:ID")]
    pub id: CodeType,

    #[serde(rename = "cbc:Name")]
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PartyLegalEntity {
    #[serde(rename = "cbc:RegistrationName")]
    pub registration_name: Option<String>,

    #[serde(rename = "cbc:CompanyID")]
    pub company_id: CompanyId,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Contact {
    #[serde(rename = "cbc:ID")]
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Delivery {
    #[serde(rename = "cbc:ActualDeliveryDate")]
    pub actual_delivery_date: String,

    #[serde(rename = "cac:DeliveryLocation")]
    pub delivery_location: DeliveryLocation,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeliveryLocation {
    #[serde(rename = "cac:Address")]
    pub address: Address,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Address {
    /*
    #[serde(rename = "cbc:AddressFormatCode")]
    pub address_format_code: CodeType,
    */

    /*
    #[serde(rename = "cbc:StreetName")]
    pub street_name: String,
    */
    #[serde(rename = "cbc:MarkAttention")]
    pub mark_attention: String,
    /*
    #[serde(rename = "cbc:CityName")]
    pub city_name: String,
    */

    /*
    #[serde(rename = "cbc:PostalZone")]
    pub postal_zone: String,
    */

    /*
    #[serde(rename = "cac:Country")]
    pub country: Country,
    */
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentMeans {
    #[serde(rename = "cbc:ID")]
    pub id: String,

    #[serde(rename = "cbc:PaymentMeansCode")]
    pub payment_means_code: String,

    #[serde(rename = "cbc:PaymentDueDate")]
    pub payment_due_date: String,

    #[serde(rename = "cbc:PaymentChannelCode")]
    pub payment_channel_code: Option<CodeType>,

    #[serde(rename = "cbc:InstructionID")]
    pub instruction_id: Option<String>,

    #[serde(rename = "cbc:PaymentID")]
    pub payment_id: Option<CodeType>,

    #[serde(rename = "cac:PayeeFinancialAccount")]
    pub payee_financial_account: Option<PayeeFinancialAccount>,

    #[serde(rename = "cac:CreditAccount")]
    pub credit_account: Option<CreditAccount>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PayeeFinancialAccount {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "FinancialInstitutionBranch")]
    pub financial_institution_branch: FinancialInstitutionBranch,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FinancialInstitutionBranch {
    #[serde(rename = "ID")]
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreditAccount {
    #[serde(rename = "AccountID")]
    pub account_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PaymentTerms {
    #[serde(rename = "ID")]
    pub id: String,

    #[serde(rename = "PaymentMeansID")]
    pub payment_means_id: String,

    #[serde(rename = "Note")]
    pub note: String,

    #[serde(rename = "Amount")]
    pub amount: Amount,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Amount {
    #[serde(rename = "@currencyID")]
    pub currency_id: String,

    #[serde(rename = "#text")]
    pub value: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxTotal {
    #[serde(rename = "cbc:TaxAmount")]
    pub tax_amount: Amount,

    #[serde(rename = "cac:TaxSubtotal")]
    pub tax_subtotals: Vec<TaxSubtotal>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxSubtotal {
    #[serde(rename = "cbc:TaxableAmount")]
    pub taxable_amount: Amount,

    #[serde(rename = "cbc:TaxAmount")]
    pub tax_amount: Amount,

    #[serde(rename = "cac:TaxCategory")]
    pub tax_category: TaxCategory,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TaxCategory {
    #[serde(rename = "cbc:ID")]
    pub id: CodeType,

    #[serde(rename = "cbc:Percent")]
    pub percent: String,

    #[serde(rename = "cac:TaxScheme")]
    pub tax_scheme: TaxScheme,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct LegalMonetaryTotal {
    #[serde(rename = "LineExtensionAmount")]
    pub line_extension_amount: Amount,

    #[serde(rename = "TaxExclusiveAmount")]
    pub tax_exclusive_amount: Amount,

    #[serde(rename = "TaxInclusiveAmount")]
    pub tax_inclusive_amount: Amount,

    #[serde(rename = "PayableAmount")]
    pub payable_amount: Amount,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceLine {
    #[serde(rename = "cbc:ID")]
    pub id: String,

    #[serde(rename = "cbc:Note")]
    pub note: String,

    #[serde(rename = "cbc:InvoicedQuantity")]
    pub invoiced_quantity: Quantity,

    #[serde(rename = "cbc:LineExtensionAmount")]
    pub line_extension_amount: Amount,

    #[serde(rename = "cac:Delivery")]
    pub delivery: InvoiceLineDelivery,

    #[serde(rename = "cac:TaxTotal")]
    pub tax_total: TaxTotal,

    #[serde(rename = "cac:Item")]
    pub item: Item,

    #[serde(rename = "cac:Price")]
    pub price: Price,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Quantity {
    #[serde(rename = "@unitCode")]
    pub unit_code: String,

    #[serde(rename = "#text")]
    pub value: f64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct InvoiceLineDelivery {
    #[serde(rename = "cac:DeliveryParty")]
    pub delivery_party: DeliveryParty,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DeliveryParty {
    #[serde(rename = "cac:PartyName")]
    pub party_name: PartyName,

    #[serde(rename = "cac:PartyLegalEntity")]
    pub party_legal_entity: PartyLegalEntity,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Item {
    #[serde(rename = "cbc:Description")]
    pub description: String,

    #[serde(rename = "cbc:Name")]
    pub name: String,

    #[serde(rename = "cac:SellersItemIdentification")]
    pub sellers_item_identification: SellersItemIdentification,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SellersItemIdentification {
    #[serde(rename = "cbc:ID")]
    pub id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Price {
    #[serde(rename = "cbc:PriceAmount")]
    pub price_amount: Amount,

    #[serde(rename = "cbc:BaseQuantity")]
    pub base_quantity: Quantity,

    #[serde(rename = "cbc:OrderableUnitFactorRate")]
    pub orderable_unit_factor_rate: String,
}
