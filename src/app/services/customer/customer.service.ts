import { Injectable, inject, type Signal, signal } from '@angular/core';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type { Settings } from '@atlas/models';
import type { BusinessDocumentCustomer } from '@atlas/models/business-document-customer.model';
import type { PrivateDocumentCustomer } from '@atlas/models/private-document-customer.model';
import type { Customer, WorkflowState } from '@atlas/types';
import { CustomerWorkflowItem } from '@atlas/workflow-items/customer';
import { combineLatestWith, map, tap } from 'rxjs';

import { EventBusService } from '../event-bus';
import { SettingsService } from '../settings';

@Injectable({ providedIn: 'root' })
export class CustomerService {
	readonly #eventBus = inject(EventBusService);
	readonly #settingsService = inject(SettingsService);

	readonly #state = signal<WorkflowState>('idle');
	readonly #customers = signal<CustomerWorkflowItem[]>([]);

	constructor() {
		this.#eventBus.documentsEvents
			.pipe(
				map((documents) =>
					Object.values(documents.privateCustomerMap)
						.map(toPrivateCustomer)
						.concat(Object.values(documents.businessCustomerMap).map(toBusinessCustomer))
						.map((customer) => new CustomerWorkflowItem(customer)),
				),
				tap((customers) => {
					this.#customers.set(customers);
				}),
				combineLatestWith(this.#eventBus.settingsEvents),
			)
			.subscribe(async ([customers, settings]) => {
				this.#state.set('running');
				await this.#createCustomers(customers, settings);
			});
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get customers(): Signal<CustomerWorkflowItem[]> {
		return this.#customers.asReadonly();
	}

	async run(): Promise<void> {
		this.#state.set('running');
		const customers = this.#customers();
		const settings = await this.#settingsService.loadSettings();
		await this.#createCustomers(customers, settings);
	}

	async #createCustomers(customers: CustomerWorkflowItem[], settings: Settings) {
		await Promise.all(customers.map((customer) => customer.create(settings)))
			.then(
				(createdCustomers) =>
					new Map(createdCustomers.map((createdCustomer) => [toCustomerMapKey(createdCustomer), createdCustomer])),
			)
			.then((customerMap) => {
				this.#eventBus.emitCustomerMap(customerMap);
				this.#state.set('completed');
			})
			.catch(() => {
				const state = this.#customers().some((customer) => customer.state() === 'failed') ? 'failed' : 'blocked';
				this.#state.set(state);
			});
	}
}

function toPrivateCustomer(customer: PrivateDocumentCustomer): Customer {
	return {
		...customer,
		type: 'private',
		group: null,
		vatZone: null,
		paymentTerms: null,
	};
}

function toBusinessCustomer(customer: BusinessDocumentCustomer): Customer {
	return {
		...customer,
		type: 'business',
		group: null,
		vatZone: null,
		paymentTerms: null,
	};
}
