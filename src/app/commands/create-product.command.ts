import { invoke } from "@tauri-apps/api/core";
import { NewProduct, Tokens } from "../models";
import { parseError } from "../functions/parse-error";


export async function createProduct(product: NewProduct, tokens: Tokens): Promise<void> {
    await invoke("create_product", { product, tokens }).catch((error) => {
        throw parseError(error);
    });
}