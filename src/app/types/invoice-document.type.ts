import type { BillingLine } from './billing-line.type';
import type { CustomerReference } from './customer-reference.type';

export type InvoiceDocument = {
	type: 'invoice';
	id: string;
	date: string;
	customer: CustomerReference;
	damageNumber: string | null;
	lines: BillingLine[];
};
