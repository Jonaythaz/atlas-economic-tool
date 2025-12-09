import { computed, inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createCustomer } from "../../commands";
import { CustomerModel, Defaults, NewCustomer, Tokens } from "../../models";
import { InvoiceService } from "../invoice";
import { Customer, CustomerState } from "../../types";
import { CustomerModalService } from "../../modals/customer";
import { fetchCustomer } from "../../commands/fetch-customer.command";

@Injectable({ providedIn: 'root' })
export class CustomerService {
    readonly #invoiceService = inject(InvoiceService);
    readonly #customerModalService = inject(CustomerModalService);

    readonly #customerMap = computed(() => new Map(this.#invoiceService.invoices()?.map(i => [i.customer.id, i.customer])));
    readonly #customers = linkedSignal<Customer[]>(() => Array.from(this.#customerMap().values()).map(customer => ({ ...customer, state: { status: 'pending' } })));
    readonly #hasErrors = computed(() => this.#customers().some(customer => customer.state.status === 'error'));

    get customers(): Signal<Customer[]> {
        return this.#customers;
    }

    get hasErrors(): Signal<boolean> {
        return this.#hasErrors;
    }

    async editCustomer(customer: Customer): Promise<void> {
        await this.#customerModalService.open(customer).then((updatedCustomer) => {
            if (updatedCustomer) {
                this.#customers.update((customers) => customers.map((c) => c.id === updatedCustomer.id ? updatedCustomer : c));
            }
        });
    }

    async createCustomers(tokens: Tokens, defaults: Defaults): Promise<Customer[]> {
        this.#customers.update((customers) => customers.map((customer) => ({ ...customer, state: customer.state.status !== 'created' ? { status: 'creating' } : customer.state })));
        const customerCreations = this.#customers()
            .filter((customer) => customer.state.status === 'creating')
            .map((customer) => this.#createCustomer(customer, tokens, defaults).then((customerResult) => {
                this.#customers.update((customers) => customers.map((c) => c.id === customerResult.id ? customerResult : c));
                return customerResult;
            }));
        return Promise.all(customerCreations);
    }

    async fetchCustomer(id: string, externalId: number, tokens: Tokens): Promise<Customer> {
        return fetchCustomer(externalId, tokens.secret, tokens.grant)
            .then((fetchedCustomer) => fromFetchedCustomer(fetchedCustomer, id));
    }

    async #createCustomer(customer: Customer, tokens: Tokens, defaults: Defaults): Promise<Customer> {
        const newCustomer = toNewCustomer(customer, defaults);
        return createCustomer(newCustomer, tokens.secret, tokens.grant).then(
            (externalId) => fromNewCustomer(newCustomer, customer.id, { status: 'created', externalId }),
            (error) => fromNewCustomer(newCustomer, customer.id, { status: 'error', errorMessage: error.message })
        );
    }
}

function fromFetchedCustomer(customer: CustomerModel, id: string): Customer {
    return {
        id,
        name: customer.name,
        group: customer.group,
        paymentTerms: customer.paymentTerms,
        vatZone: customer.vatZone,
        state: { status: 'created', externalId: customer.externalId },
    };
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