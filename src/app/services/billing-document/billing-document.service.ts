import { Injectable, inject, type Signal, signal } from '@angular/core';
import type { Settings } from '@atlas/models';
import type { CreatedCustomer, CreatedProduct, WorkflowState } from '@atlas/types';
import { BillingDocumentWorkflowItem } from '@atlas/workflow-items/billing-document';
import { combineLatestWith, map, tap } from 'rxjs';

import { EventBusService } from '../event-bus';

@Injectable({ providedIn: 'root' })
export class BillingDocumentService {
	readonly #eventBus = inject(EventBusService);

	readonly #state = signal<WorkflowState>('idle');
	readonly #billingDocuments = signal<BillingDocumentWorkflowItem[]>([]);

	constructor() {
		this.#eventBus.documentsEvents
			.pipe(
				map((documents) => documents.documents.map((document) => new BillingDocumentWorkflowItem(document))),
				tap((billingDocuments) => {
					this.#billingDocuments.set(billingDocuments);
				}),
				combineLatestWith(
					this.#eventBus.customerMapEvents,
					this.#eventBus.productMapEvents,
					this.#eventBus.settingsEvents,
				),
			)
			.subscribe(async ([billingDocuments, customerMap, productMap, settings]) => {
				this.#state.set('running');
				await this.#createInvoices(billingDocuments, customerMap, productMap, settings);
			});
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get billingDocuments(): Signal<BillingDocumentWorkflowItem[]> {
		return this.#billingDocuments.asReadonly();
	}

	async #createInvoices(
		billingDocuments: BillingDocumentWorkflowItem[],
		customerMap: Map<string, CreatedCustomer>,
		productMap: Map<string, CreatedProduct>,
		settings: Settings,
	): Promise<void> {
		await Promise.all(
			billingDocuments.map((billingDocument) => billingDocument.create(customerMap, productMap, settings)),
		)
			.then(() => {
				this.#state.set('completed');
			})
			.catch(() => {
				const state = this.#billingDocuments().some((invoice) => invoice.state() === 'failed') ? 'failed' : 'blocked';
				this.#state.set(state);
			});
	}
}
