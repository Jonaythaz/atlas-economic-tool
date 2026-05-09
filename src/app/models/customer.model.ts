export type CustomerModel = BusinessCustomerModel | PrivateCustomerModel;

type BusinessCustomerModel = {
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

type PrivateCustomerModel = {
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
