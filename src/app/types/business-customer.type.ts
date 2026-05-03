export type BusinessCustomer = {
	type: 'business';
	id: number | null;
	ean: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number | null;
	vatZone: number | null;
	paymentTerms: number | null;
};
