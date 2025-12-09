import { computed, inject, Injectable, resource, Signal } from "@angular/core";
import { createInvoice, loadInvoices } from "../../commands";
import { Defaults, InvoiceModel, NewInvoice, Tokens } from "../../models";
import { InvoiceModalService } from "../../modals/invoice";
import { Invoice } from "../../types";

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    readonly #invoiceModalService = inject(InvoiceModalService);

    readonly #invoiceResource = resource({
        loader: ({ previous }) => previous.status === 'idle' ? Promise.resolve(undefined) : loadInvoices()
    });

    readonly #invoices = computed(() => this.#invoiceResource.hasValue() ? this.#invoiceResource.value() : []);
    readonly #error = computed(() => this.#invoiceResource.error()?.message);

    get invoices(): Signal<InvoiceModel[]> {
        return this.#invoices;
    }

    get error(): Signal<string | undefined> {
        return this.#error;
    }

    get isLoading(): Signal<boolean> {
        return this.#invoiceResource.isLoading;
    }

    loadInvoices(): void {
        this.#invoiceResource.reload();
    }

    async viewInvoice(invoice: Invoice): Promise<void> {
        await this.#invoiceModalService.openInvoiceModal(invoice);
    }

    async createInvoice(invoice: InvoiceModel, customerMap: Map<string, number>, tokens: Tokens, defaults: Defaults): Promise<void> {
        const { layout, paymentTerms, vatZone } = defaults;
        if (layout === undefined || paymentTerms === undefined || vatZone === undefined) {
            throw new Error('Missing default values for creating invoice.');
        }
        const customerId = customerMap.get(invoice.customer.id);
        if (customerId === undefined) {
            return Promise.reject(new Error(`Missing external ID for customer with ID ${invoice.customer.id}`));
        }
        const newInvoice = toNewInvoice(invoice, customerId, layout, paymentTerms, vatZone);
        await createInvoice(newInvoice, tokens.secret, tokens.grant);
    }
}

function toNewInvoice(invoice: InvoiceModel, customer: number, layout: number, paymentTerms: number, vatZone: number): NewInvoice {
    return {
        layout,
        customer,
        date: invoice.date,
        recipient: invoice.recipient,
        paymentTerms: paymentTerms,
        vatZone: vatZone,
        damageNumber: invoice.damageNumber,
        lines: invoice.lines.map((line) => ({
            product: line.product.id,
            price: line.price,
            quantity: line.quantity,
        }))
    };
}