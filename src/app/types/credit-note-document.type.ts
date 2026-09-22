import type { BillingLine } from './billing-line.type';
import type { CreatedCustomer } from './created-customer.type';

export type CreditNoteDocument = {
	type: 'credit-note';
	id: number;
	invoiceId: string;
	date: string;
	layout: number | null;
	paymentTerms: number | null;
	customer: CreatedCustomer | null;
	damageNumber: string | null;
	lines: BillingLine[];
};
