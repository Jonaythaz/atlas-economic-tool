import { signal } from '@angular/core';
import { type FieldTree, form, readonly, required } from '@angular/forms/signals';
import type { Defaults } from '@atlas/models';
import type { Defined, Product } from '@atlas/types';

export function productForm(product: Product, defaults: Defaults): FieldTree<Defined<Product>> {
	const model = signal({
		...product,
		group: product.group ?? defaults.productGroup ?? NaN,
	});
	return form(model, (schema) => {
		readonly(schema.id);
		required(schema.name, { message: 'Product name is required' });
		required(schema.description, { message: 'Product description is required' });
		required(schema.group, { message: 'Product group is required' });
	});
}
