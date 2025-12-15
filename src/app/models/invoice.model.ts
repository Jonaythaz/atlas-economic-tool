import { DocumentCustomer } from "./document-customer.model";
import { DocumentLine } from "./document-line.model";

export type InvoiceModel = {
    type: 'invoice';
    id: string;
    date: string;
    damageNumber?: string;
    customer: DocumentCustomer;
    recipient: string;
    lines: DocumentLine[];
};