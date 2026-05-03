export type PrivateCustomer = {
	type: 'private';
	id: number | null;
	email: string | null;
	cpr: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number | null;
	vatZone: number | null;
	paymentTerms: number | null;
};
