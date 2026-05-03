import type { CustomerReferenceModel } from './customer-reference.model';
import type { DocumentLine } from './document-line.model';

export type CreditNoteModel = {
	type: 'credit-note';
	id: string;
	invoiceId: string;
	date: string;
	customer: CustomerReferenceModel;
	damageNumber: string | null;
	lines: DocumentLine[];
};
