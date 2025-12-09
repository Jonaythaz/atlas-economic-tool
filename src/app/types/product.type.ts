import { ProductState } from "./product-state.type";

export type Product = {
    id: string;
    name: string;
    group?: number;
    state: ProductState;
};
