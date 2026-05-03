import type { CustomerReferenceModel } from './customer-reference.model';
import type { DocumentLine } from './document-line.model';

export type InvoiceModel = {
	type: 'invoice';
	id: string;
	date: string;
	customer: CustomerReferenceModel;
	damageNumber: string | null;
	lines: DocumentLine[];
};
