import type { BillingLine } from './billing-line.type';
import type { CreatedCustomer } from './created-customer.type';

export type InvoiceDocument = {
	type: 'invoice';
	id: number;
	date: string;
	customer: CreatedCustomer | null;
	damageNumber: string | null;
	lines: BillingLine[];
};
