export type CustomerReferenceModel = BusinessCustomerReferenceModel | PrivateCustomerReferenceModel;

export type BusinessCustomerReferenceModel = {
	type: 'business';
	ean: string;
};

export type PrivateCustomerReferenceModel = {
	type: 'private';
	cpr: string;
};
