import { invoke } from "@tauri-apps/api/core";
import { ProductModel, Tokens } from "../models";
import { parseError } from "../functions/parse-error";

export async function fetchProduct(id: string, tokens: Tokens): Promise<ProductModel | null> {
    return invoke<ProductModel | null>("fetch_product", { id, tokens }).catch((error) => {
        throw parseError(error);
    });
}