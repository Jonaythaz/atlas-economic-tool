import type { CustomerReference } from './customer-reference.type';
import type { DocumentLine } from './document-line.type';

export type InvoiceDocument = {
	type: 'invoice';
	id: string;
	date: string;
	customer: CustomerReference;
	damageNumber: string | null;
	lines: DocumentLine[];
};
