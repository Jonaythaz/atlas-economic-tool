import { computed, type Signal, signal, type WritableSignal } from '@angular/core';
import { createProduct } from '@atlas/commands';
import type { Defaults, NewProduct, Settings } from '@atlas/models';
import type { CreatedProduct, Product, WorkflowState } from '@atlas/types';

export class ProductWorkflowItem {
	readonly #product: WritableSignal<Product>;
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);
	readonly #createdProduct = signal<CreatedProduct | null>(null);

	readonly #value = computed(() => this.#createdProduct() ?? this.#product());

	constructor(product: Product) {
		this.#product = signal(product);
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<Product> {
		return this.#value;
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	set value(product: Product) {
		this.#product.set(product);
		this.#createdProduct.set(null);
		this.#state.set('idle');
	}

	async create(settings: Settings): Promise<CreatedProduct> {
		const createdProduct = this.#createdProduct();
		if (createdProduct !== null) {
			return createdProduct;
		}
		this.#state.set('running');

		const product = this.#product();
		const newProduct = toNewProduct(product, settings.defaults);

		if (newProduct === undefined) {
			this.#state.set('blocked');
			throw new Error('Missing required field');
		}

		return createProduct(newProduct, settings.tokens)
			.then((createdProduct) => ({
				...createdProduct,
				description: product.description,
			}))
			.then(
				(createdProduct) => {
					this.#createdProduct.set(createdProduct);
					this.#state.set('completed');
					return createdProduct;
				},
				(error) => {
					this.#errorMessage.set(error.message ?? 'Unexpected error occured');
					this.#state.set('failed');
					throw error;
				},
			);
	}
}

function toNewProduct(product: Product, defaults: Defaults): NewProduct | undefined {
	const group = product.group ?? defaults.productGroup;
	if (group === null) {
		return undefined;
	}
	return {
		id: product.id,
		name: product.name,
		group,
	};
}
