import type { CreatedProduct } from './created-product.type';

export type BillingLine = {
	product: CreatedProduct | null;
	description: string;
	price: number;
	quantity: number;
	discount: number | null;
};
