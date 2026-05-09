import { createProduct } from '@atlas/commands';
import type { Defaults, NewProduct, Settings } from '@atlas/models';
import type { CreatedProduct, Product } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

export class ProductPipelineItem extends PipelineItem<Product, CreatedProduct, Settings> {
	protected async processInternal(dependencies: Settings): Promise<CreatedProduct> {
		const product = this.input();
		const newProduct = toNewProduct(product, dependencies.defaults);
		return createProduct(newProduct, dependencies.tokens).then((createdProduct) => ({
			...createdProduct,
			description: product.description,
		}));
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
