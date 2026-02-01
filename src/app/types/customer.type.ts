export type Customer = {
	id?: number;
	ean: string;
	name: string;
	group?: number;
	vatZone?: number;
	paymentTerms?: number;
};
