import type { NewInvoiceLine } from './new-invoice-line.model';

export type NewInvoice = {
	date: string;
	layout: number;
	customer: number;
	recipientEan: string;
	recipientName: string;
	recipientStreet: string;
	recipientCity: string;
	recipientPostalCode: string;
	recipientCountry: string;
	paymentTerms: number;
	vatZone: number;
	damageNumber?: string;
	lines: NewInvoiceLine[];
};
