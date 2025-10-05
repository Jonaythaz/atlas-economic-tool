import { Product } from "./product.model";

export type InvoiceLine = {
    product: Product;
    price: number;
    quantity: number;
};