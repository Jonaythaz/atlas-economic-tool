import { invoke } from "@tauri-apps/api/core";
import { ProductModel } from "../models";

export function fetchProduct(id: string, secret: string, grant: string): Promise<ProductModel> {
    return invoke<ProductModel>("fetch_product", { id, secret, grant }).catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}