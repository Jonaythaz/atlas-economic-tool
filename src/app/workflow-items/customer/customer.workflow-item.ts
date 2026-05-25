import { computed, type Signal, signal, type WritableSignal } from '@angular/core';
import { createCustomer } from '@atlas/commands';
import type { Defaults, NewCustomer, Settings } from '@atlas/models';
import type { CreatedCustomer, Customer, WorkflowState } from '@atlas/types';

export class CustomerWorkflowItem {
	readonly #customer: WritableSignal<Customer>;
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);
	readonly #createdCustomer = signal<CreatedCustomer | null>(null);

	readonly #value = computed(() => this.#createdCustomer() ?? this.#customer());

	constructor(customer: Customer) {
		this.#customer = signal(customer);
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<Customer> {
		return this.#value;
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	set value(customer: Customer) {
		this.#customer.set(customer);
		this.#createdCustomer.set(null);
		this.#state.set('idle');
	}

	async create(settings: Settings): Promise<CreatedCustomer> {
		const createdCustomer = this.#createdCustomer();
		if (createdCustomer !== null) {
			return createdCustomer;
		}
		this.#state.set('running');

		const customer = this.#customer();
		const newCustomer = toNewCustomer(customer, settings.defaults);

		if (newCustomer === undefined) {
			this.#state.set('blocked');
			throw new Error('Missing required field');
		}

		return createCustomer(newCustomer, settings.tokens)
			.then((createdCustomer) => {
				if (createdCustomer.type === 'business') {
					return createdCustomer;
				}
				if (customer.type === 'business') {
					throw new Error('Created customer is a person but input customer is a business');
				}
				const email = createdCustomer.email;
				if (email === null) {
					throw new Error('External customer is missing email, please update the customer in e-conomic and try again');
				}
				return {
					...createdCustomer,
					cpr: customer.cpr,
					email,
				};
			})
			.then(
				(createdCustomer) => {
					this.#createdCustomer.set(createdCustomer);
					this.#state.set('completed');
					return createdCustomer;
				},
				(error) => {
					this.#errorMessage.set(error.message ?? 'Unexpected error occured');
					this.#state.set('failed');
					throw error;
				},
			);
	}
}

function toNewCustomer(customer: Customer, defaults: Defaults): NewCustomer | undefined {
	const id = customer.id;
	const group = customer.group ?? defaults.customerGroup;
	const vatZone = customer.vatZone ?? defaults.vatZone;
	const paymentTerms = customer.paymentTerms ?? defaults.paymentTerms;
	if (id === null || group === null || vatZone === null || paymentTerms === null) {
		return undefined;
	}
	if (customer.type === 'business') {
		return {
			...customer,
			id,
			group,
			vatZone,
			paymentTerms,
		};
	}
	const email = customer.email;
	if (email === null) {
		return undefined;
	}
	return {
		...customer,
		id,
		email,
		group,
		vatZone,
		paymentTerms,
	};
}
