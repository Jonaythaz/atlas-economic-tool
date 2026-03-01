export type Customer = {
	id?: number;
	ean: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group?: number;
	vatZone?: number;
	paymentTerms?: number;
};
