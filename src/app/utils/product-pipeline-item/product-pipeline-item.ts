import { createProduct, fetchProduct } from '@atlas/commands';
import type { Defaults, NewProduct, ProductModel, Settings } from '@atlas/models';
import type { Product } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

export class ProductPipelineItem extends PipelineItem<Product, ProductModel, Settings> {
	protected async processInternal(dependencies: Settings): Promise<ProductModel> {
		const product = this.input();
		const existingProduct = await fetchProduct(product.id, dependencies.tokens);
		if (existingProduct) {
			return existingProduct;
		}
		const newProduct = toNewProduct(product, dependencies.defaults);
		return createProduct(newProduct, dependencies.tokens);
	}
}

function toNewProduct(product: Product, defaults: Defaults): NewProduct {
	const group = product.group ?? defaults.productGroup;
	if (group === null) {
		throw new Error('Could not create product because of missing default value.');
	}
	return {
		id: product.id,
		name: product.name,
		group,
	};
}
