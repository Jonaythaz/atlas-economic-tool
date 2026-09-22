export type BillingRecipient = BillingBusinessRecipient | BillingPrivateRecipient;

type BillingRecipientBase = {
	name: string;
	street: string;
	city: string;
	postalCode: string;
	country: string;
	vatNumber: number;
};

type BillingBusinessRecipient = BillingRecipientBase & {
	type: 'business';
	ean: string;
};

type BillingPrivateRecipient = BillingRecipientBase & {
	type: 'private';
	email: string;
};
