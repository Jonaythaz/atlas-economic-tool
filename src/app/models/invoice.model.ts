import type { DocumentCustomer } from "./document-customer.model";
import type { DocumentLine } from "./document-line.model";

export type InvoiceModel = {
	type: "invoice";
	id: string;
	date: string;
	damageNumber?: string;
	customer: DocumentCustomer;
	recipient: string;
	lines: DocumentLine[];
};
