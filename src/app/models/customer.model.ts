export type CustomerModel = BusinessCustomer | PrivateCustomer;

type BusinessCustomer = {
	type: 'business';
	id: number;
	ean: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number;
	vatZone: number;
	paymentTerms: number;
};

type PrivateCustomer = {
	type: 'private';
	id: number;
	email: string | null;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number;
	vatZone: number;
	paymentTerms: number;
};
