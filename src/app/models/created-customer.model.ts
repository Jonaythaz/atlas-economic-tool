export type CreatedCustomerModel = CreatedBusinessCustomerModel | CreatedPrivateCustomerModel;

type CreatedBusinessCustomerModel = {
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

type CreatedPrivateCustomerModel = {
	type: 'private';
	id: number;
	email: string;
	cpr: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number;
	vatZone: number;
	paymentTerms: number;
};
