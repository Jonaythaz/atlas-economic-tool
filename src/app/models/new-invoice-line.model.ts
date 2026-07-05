export type NewInvoiceLine = {
	productId: string;
	description: string;
	quantity: number;
	price: number;
	discount: number | null;
};
