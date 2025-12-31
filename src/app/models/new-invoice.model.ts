import type { NewInvoiceLine } from "./new-invoice-line.model";

export type NewInvoice = {
	date: string;
	layout: number;
	customer: number;
	recipient: string;
	paymentTerms: number;
	vatZone: number;
	damageNumber?: string;
	lines: NewInvoiceLine[];
};
