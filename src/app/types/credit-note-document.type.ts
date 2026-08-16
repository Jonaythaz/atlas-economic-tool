import type { BillingLine } from './billing-line.type';
import type { CreatedCustomer } from './created-customer.type';

export type CreditNoteDocument = {
	type: 'credit-note';
	id: number;
	invoiceId: string;
	date: string;
	customer: CreatedCustomer | null;
	damageNumber: string | null;
	lines: BillingLine[];
};
