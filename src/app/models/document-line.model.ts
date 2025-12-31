import type { DocumentProduct } from "./document-product.model";

export type DocumentLine = {
	product: DocumentProduct;
	price: number;
	quantity: number;
};
