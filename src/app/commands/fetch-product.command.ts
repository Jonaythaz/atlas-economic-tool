import { parseError } from "@atlas/functions/parse-error";
import type { ProductModel, Tokens } from "@atlas/models";
import { invoke } from "@tauri-apps/api/core";

export async function fetchProduct(id: string, tokens: Tokens): Promise<ProductModel | null> {
	return invoke<ProductModel | null>("fetch_product", { id, tokens }).catch((error) => {
		throw parseError(error);
	});
}
