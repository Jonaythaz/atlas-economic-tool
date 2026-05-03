export type NewInvoiceRecipient = NewInvoiceRecipientBusiness | NewInvoiceRecipientPrivate;

type NewInvoiceRecipientBusiness = {
	type: 'business';
	ean: string;
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	vatZone: number;
};

type NewInvoiceRecipientPrivate = {
	type: 'private';
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	vatZone: number;
};
