export type CustomerReference = BusinessCustomerReference | PrivateCustomerReference;

type BusinessCustomerReference = {
	type: 'business';
	ean: string;
};

type PrivateCustomerReference = {
	type: 'private';
	cpr: string;
};
