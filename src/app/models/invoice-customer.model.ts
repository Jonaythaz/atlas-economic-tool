export type InvoiceCustomer = {
    id: string;
    name: string;
    group?: number;
    vatZone?: number;
    paymentTerms?: number;
};