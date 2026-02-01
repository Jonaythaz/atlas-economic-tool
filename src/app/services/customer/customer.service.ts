import { computed, Injectable, inject, linkedSignal, type Signal } from "@angular/core";
import { createCustomer, findCustomer, updateCustomer } from "@atlas/commands";
import { createResources } from "@atlas/functions/create-resources";
import type { Defaults, NewCustomer, Settings } from "@atlas/models";
import { DocumentService } from "@atlas/services/document";
import type { Customer, CustomerResource } from "@atlas/types";

@Injectable({ providedIn: "root" })
export class CustomerService {
	readonly #documentService = inject(DocumentService);

	readonly #customerMap = computed(() =>
		this.#documentService.documents.hasValue()
			? new Map(this.#documentService.documents.value()?.map((document) => [document.customer.ean, document.customer]))
			: new Map(),
	);
	readonly #customers = linkedSignal<CustomerResource[]>(() =>
		Array.from(this.#customerMap().values()).map((customer) => ({
			model: customer,
			status: "pending",
		})),
	);
	readonly #hasErrors = computed(() => this.#customers().some((customer) => customer.status === "error"));

	get customers(): Signal<CustomerResource[]> {
		return this.#customers;
	}

	get hasErrors(): Signal<boolean> {
		return this.#hasErrors;
	}

	async createCustomer(customer: Customer, settings: Settings): Promise<void> {
		await this.#createCustomer(customer, settings).then(
			(createdCustomer) => this.#updateCustomer({ model: createdCustomer, status: "created" }),
			(error) => {
				const message = error instanceof Error ? error.message : "Unexpected error occured.";
				this.#updateCustomers((c) => (c.model.id === customer.id ? { ...c, status: "error", message } : c));
				throw new Error(message);
			},
		);
	}

	async updateCustomer(ean: string, id: number): Promise<void> {
		await updateCustomer(ean, id).then(
			() =>
				this.#updateCustomers((customer) =>
					customer.model.ean === ean ? { model: { ...customer.model, id }, status: "created" } : customer,
				),
			(error) => {
				const message = error instanceof Error ? error.message : "Unexpected error occured.";
				this.#updateCustomers((customer) =>
					customer.model.ean === ean ? { ...customer, status: "error", message } : customer,
				);
				throw new Error(message);
			},
		);
	}

	async createCustomers(settings: Settings): Promise<boolean> {
		return createResources({
			resources: this.#customers,
			createFn: (model) => this.#createCustomer(model, settings),
			equalFn: (c1, c2) => c1.ean === c2.ean,
		});
	}

	async #createCustomer(customer: Customer, settings: Settings): Promise<Customer> {
		const id = await findCustomer(customer.ean);
		if (id) {
			return { ...customer, id };
		}
		const newCustomer = toNewCustomer(customer, settings.defaults);
		return createCustomer(newCustomer, settings.tokens).then((id) => fromNewCustomer(newCustomer, id));
	}

	#updateCustomer(updatedCustomer: CustomerResource): void {
		this.#updateCustomers((customer) =>
			customer.model.ean === updatedCustomer.model.ean ? updatedCustomer : customer,
		);
	}

	#updateCustomers(updateFn: (resource: CustomerResource) => CustomerResource): void {
		this.#customers.update((customers) => customers.map(updateFn));
	}
}

function fromNewCustomer(customer: NewCustomer, id: number): Customer {
	return {
		id: id,
		ean: customer.ean,
		name: customer.name,
		group: customer.group,
		vatZone: customer.vatZone,
		paymentTerms: customer.paymentTerms,
	};
}

function toNewCustomer(customer: Customer, defaults: Defaults): NewCustomer {
	const group = customer.group ?? defaults.customerGroup ?? null;
	const vatZone = customer.vatZone ?? defaults.vatZone ?? null;
	const paymentTerms = customer.paymentTerms ?? defaults.paymentTerms ?? null;
	if (group === null || vatZone === null || paymentTerms === null) {
		throw new Error("Missing required fields.");
	}
	return { ean: customer.ean, name: customer.name, group, vatZone, paymentTerms };
}
