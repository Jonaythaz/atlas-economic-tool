import { parseError } from '@atlas/functions/parse-error';
import type { NewProduct, ProductModel, Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';

export async function createProduct(product: NewProduct, tokens: Tokens): Promise<ProductModel> {
	return invoke<ProductModel>('create_product', { product, tokens }).catch((error) => {
		throw parseError(error);
	});
}
