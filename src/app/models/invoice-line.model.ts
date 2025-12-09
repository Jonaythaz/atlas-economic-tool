import { InvoiceProduct } from "./invoice-product.model";

export type InvoiceLine = {
    product: InvoiceProduct;
    price: number;
    quantity: number;
};