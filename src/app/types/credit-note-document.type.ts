import type { CustomerReference } from './customer-reference.type';
import type { DocumentLine } from './document-line.type';

export type CreditNoteDocument = {
	type: 'credit-note';
	id: string;
	invoiceId: string;
	date: string;
	customer: CustomerReference;
	damageNumber: string | null;
	lines: DocumentLine[];
};
