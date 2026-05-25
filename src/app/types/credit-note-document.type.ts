import type { BillingLine } from './billing-line.type';
import type { CustomerReference } from './customer-reference.type';

export type CreditNoteDocument = {
	type: 'credit-note';
	id: string;
	invoiceId: string;
	date: string;
	customer: CustomerReference;
	damageNumber: string | null;
	lines: BillingLine[];
};
