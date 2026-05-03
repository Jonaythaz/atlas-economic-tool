import type { NewInvoiceLine } from './new-invoice-line.model';
import type { NewInvoiceRecipient } from './new-invoice-recipient.model';

export type NewInvoice = {
	date: string;
	layout: number;
	customerId: number;
	recipient: NewInvoiceRecipient;
	paymentTerms: number;
	damageNumber: string | null;
	lines: NewInvoiceLine[];
};
