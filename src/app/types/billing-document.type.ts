import type { BillingLine } from './billing-line.type';
import type { BillingRecipient } from './billing-recipient.type';

type BillingDocumentBase = {
	id: number;
	customerId: number;
	date: string;
	layout: number;
	paymentTerms: number;
	damageNumber: string;
	currency: string;
	recipient: BillingRecipient;
	lines: BillingLine[];
};

export type BillingDocument =
	| (BillingDocumentBase & {
			type: 'invoice';
	  })
	| (BillingDocumentBase & {
			type: 'credit-note';
			invoiceId: string;
	  });
