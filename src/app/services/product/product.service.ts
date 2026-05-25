import { Injectable, inject, type Signal, signal } from '@angular/core';
import type { Settings } from '@atlas/models';
import type { WorkflowState } from '@atlas/types';
import { ProductWorkflowItem } from '@atlas/workflow-items/product';
import { combineLatestWith, map, tap } from 'rxjs';

import { EventBusService } from '../event-bus';
import { SettingsService } from '../settings';

@Injectable({ providedIn: 'root' })
export class ProductService {
	readonly #eventBus = inject(EventBusService);
	readonly #settingsService = inject(SettingsService);

	readonly #state = signal<WorkflowState>('idle');
	readonly #products = signal<ProductWorkflowItem[]>([]);

	constructor() {
		this.#eventBus.documentsEvents
			.pipe(
				map((documents) =>
					Object.values(documents.productMap).map((product) => new ProductWorkflowItem({ ...product, group: null })),
				),
				tap((products) => {
					this.#products.set(products);
				}),
				combineLatestWith(this.#eventBus.settingsEvents),
			)
			.subscribe(async ([products, settings]) => {
				this.#state.set('running');
				await this.#createProducts(products, settings);
			});
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get products(): Signal<ProductWorkflowItem[]> {
		return this.#products.asReadonly();
	}

	async run(): Promise<void> {
		this.#state.set('running');
		const products = this.#products();
		const settings = await this.#settingsService.loadSettings();
		await this.#createProducts(products, settings);
	}

	async #createProducts(products: ProductWorkflowItem[], settings: Settings) {
		await Promise.all(products.map((product) => product.create(settings)))
			.then((createdProduct) => new Map(createdProduct.map((createdProduct) => [createdProduct.id, createdProduct])))
			.then((productMap) => {
				this.#eventBus.emitProductMap(productMap);
				this.#state.set('completed');
			})
			.catch(() => {
				const state = this.#products().some((product) => product.state() === 'failed') ? 'failed' : 'blocked';
				this.#state.set(state);
			});
	}
}
