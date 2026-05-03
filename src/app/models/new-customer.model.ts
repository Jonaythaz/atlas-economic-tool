export type NewCustomer = NewCustomerPrivate | NewCustomerBusiness;

export type NewCustomerPrivate = {
	type: 'private';
	id: number;
	email: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	group: number;
	vatZone: number;
	paymentTerms: number;
};

export type NewCustomerBusiness = {
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
