import { computed, inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createCustomer, findCustomer, updateCustomer } from "../../commands";
import { Defaults, NewCustomer, Tokens } from "../../models";
import { Customer, CustomerState } from "../../types";
import { CustomerModalService } from "../../modals/customer";
import { DocumentService } from "../document";

@Injectable({ providedIn: 'root' })
export class CustomerService {
    readonly #documentService = inject(DocumentService);
    readonly #customerModalService = inject(CustomerModalService);

    readonly #customerMap = computed(() => new Map(this.#documentService.documents()?.map(document => [document.customer.id, document.customer])));
    readonly #customers = linkedSignal<Customer[]>(() => Array.from(this.#customerMap().values()).map(customer => ({ ...customer, state: { status: 'pending' } })));
    readonly #hasErrors = computed(() => this.#customers().some(customer => customer.state.status === 'error'));

    get customers(): Signal<Customer[]> {
        return this.#customers;
    }

    get hasErrors(): Signal<boolean> {
        return this.#hasErrors;
    }

    async editCustomer(customer: Customer): Promise<void> {
        await this.#customerModalService.open(customer).then(async (updatedCustomer) => {
            if (!updatedCustomer) {
                return;
            }
            
            this.#customers.update((customers) => customers.map((c) => c.id === updatedCustomer.id ? updatedCustomer : c));
            
            if (updatedCustomer.state.status === 'created') {
                await updateCustomer(updatedCustomer.id, updatedCustomer.state.externalId);
            }
        });
    }

    async createCustomers(tokens: Tokens, defaults: Defaults): Promise<Customer[]> {
        this.#customers.update((customers) => customers.map((customer) => ({ ...customer, state: customer.state.status !== 'created' ? { status: 'creating' } : customer.state })));
        const customerCreations = this.#customers()
            .filter((customer) => customer.state.status === 'creating')
            .map((customer) => this.#findCustomer(customer)
                .then(async (foundCustomer) => foundCustomer ?? await this.#createCustomer(customer, tokens, defaults))
                .catch((error: Error) => ({ ...customer, state: { status: 'error', errorMessage: error.message }} satisfies Customer))
                .then((customerResult) => {
                    this.#customers.update((customers) => customers.map((c) => c.id === customerResult.id ? customerResult : c));
                    return customerResult;
                })
            );
        return Promise.all(customerCreations);
    }

    async #findCustomer(customer: Customer): Promise<Customer | null> {
        return findCustomer(customer.id).then((externalId) =>
            externalId 
                ? { ...customer, state: { status: 'created', externalId } }
                : null
        );
    }

    async #createCustomer(customer: Customer, tokens: Tokens, defaults: Defaults): Promise<Customer> {
        const newCustomer = toNewCustomer(customer, defaults);
        return createCustomer(customer.id, newCustomer, tokens).then(
            (externalId) => fromNewCustomer(newCustomer, customer.id, { status: 'created', externalId })
        );
    }
}

function fromNewCustomer(customer: NewCustomer, id: string, state: CustomerState): Customer {
    return {
        id,
        name: customer.name,
        group: customer.group,
        vatZone: customer.vatZone,
        paymentTerms: customer.paymentTerms,
        state
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