import { DocumentCustomer } from "./document-customer.model";
import { DocumentLine } from "./document-line.model";

export type CreditNoteModel = {
    type: 'credit-note';
    id: string;
    invoiceId: string;
    date: string;
    customer: DocumentCustomer;
    lines: DocumentLine[];
};