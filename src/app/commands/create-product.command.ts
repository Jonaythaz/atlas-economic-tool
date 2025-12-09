import { invoke } from "@tauri-apps/api/core";
import { NewProduct } from "../models";


export async function createProduct(product: NewProduct, secret: string, grant: string): Promise<void> {
    await invoke("create_product", { product, secret, grant }).catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}