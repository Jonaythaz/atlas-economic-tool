import { computed, inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createCustomer, findCustomer, updateCustomer } from "../../commands";
import { Defaults, NewCustomer, Settings } from "../../models";
import { CreatedCustomer, Customer, CustomerResource } from "../../types";
import { DocumentService } from "../document";
import { createResources } from "../../functions/create-resources";

@Injectable({ providedIn: 'root' })
export class CustomerService {
    readonly #documentService = inject(DocumentService);

    readonly #customerMap = computed(() => new Map(this.#documentService.documents()?.map(document => [document.customer.id, document.customer])));
    readonly #customers = linkedSignal<CustomerResource[]>(() => Array.from(this.#customerMap().values()).map(customer => ({ model: customer, status: 'pending' })));
    readonly #hasErrors = computed(() => this.#customers().some(customer => customer.status === 'error'));

    get customers(): Signal<CustomerResource[]> {
        return this.#customers;
    }

    get hasErrors(): Signal<boolean> {
        return this.#hasErrors;
    }

    async createCustomer(customer: Customer, settings: Settings): Promise<void> {
        await this.#createCustomer(customer, settings).then(
            (createdCustomer) => this.#updateCustomer({ model: createdCustomer, status: 'created' }),
            (error) => {
                const message = error instanceof Error ? error.message : 'Unexpected error occured.';
                this.#updateCustomers((c) => 
                    c.model.id === customer.id ? { ...c, status: 'error', message } : c
                );
            }
        );
    }

    async updateCustomer(id: string, externalId: number): Promise<void> {
        await updateCustomer(id, externalId).then(
            () => this.#updateCustomers((customer) => 
                customer.model.id === id ? { model: { ...customer.model, externalId }, status: 'created' } : customer
            ),
            (error) => {
                const message = error instanceof Error ? error.message : 'Unexpected error occured.';
                this.#updateCustomers((customer) => 
                    customer.model.id === id ? { ...customer, status: 'error', message } : customer
                );
            }
        );
    }

    async createCustomers(settings: Settings): Promise<boolean> {
        return createResources({
            resources: this.#customers,
            createFn: (model) => this.#createCustomer(model, settings),
            equalFn: (c1, c2) => c1.id === c2.id
        });
    }

    async #createCustomer(customer: Customer, settings: Settings): Promise<CreatedCustomer> {
        const externalId = await findCustomer(customer.id);
        if (externalId) {
            return { ...customer, externalId };
        }
        const newCustomer = toNewCustomer(customer, settings.defaults);
        return createCustomer(customer.id, newCustomer, settings.tokens).then(
            (externalId) => fromNewCustomer(newCustomer, customer.id, externalId)
        );
    }

    #updateCustomer(updatedCustomer: CustomerResource): void {
        this.#updateCustomers((customer) => 
            customer.model.id === updatedCustomer.model.id ? updatedCustomer : customer
        );
    }

    #updateCustomers(updateFn: (resource: CustomerResource) => CustomerResource): void {
        this.#customers.update((customers) => customers.map(updateFn));
    }
}

function fromNewCustomer(customer: NewCustomer, id: string, externalId: number): CreatedCustomer {
    return {
        id,
        name: customer.name,
        group: customer.group,
        vatZone: customer.vatZone,
        paymentTerms: customer.paymentTerms,
        externalId
    };
}

function toNewCustomer(customer: Customer, defaults: Defaults): NewCustomer {
    const group = customer.group ?? defaults.customerGroup;
    const vatZone = customer.vatZone ?? defaults.vatZone;
    const paymentTerms = customer.paymentTerms ?? defaults.paymentTerms;
    if (group === undefined || vatZone === undefined || paymentTerms === undefined) {
        throw new Error('Could not create customer because of missing default value.');
    }
    return { name: customer.name, group, vatZone, paymentTerms };
}