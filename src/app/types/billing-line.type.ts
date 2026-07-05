export type BillingLine = {
	productId: string;
	description: string;
	price: number;
	quantity: number;
	discount: number | null;
};
