import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";
import type { NewProduct, Tokens } from "../models";

export async function createProduct(product: NewProduct, tokens: Tokens): Promise<void> {
	await invoke("create_product", { product, tokens }).catch((error) => {
		throw parseError(error);
	});
}
