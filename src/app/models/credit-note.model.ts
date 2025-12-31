import type { DocumentCustomer } from "./document-customer.model";
import type { DocumentLine } from "./document-line.model";

export type CreditNoteModel = {
	type: "credit-note";
	id: string;
	invoiceId: string;
	damageNumber?: string;
	date: string;
	customer: DocumentCustomer;
	lines: DocumentLine[];
};
