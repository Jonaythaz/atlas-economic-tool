import { inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createInvoice } from "../../commands";
import { Defaults, InvoiceModel, NewInvoice, Tokens } from "../../models";
import { InvoiceModalService } from "../../modals/invoice";
import { Invoice } from "../../types";
import { DocumentService } from "../document";

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    readonly #documentService = inject(DocumentService);
    readonly #invoiceModalService = inject(InvoiceModalService);

    readonly #invoices = linkedSignal<Invoice[]>(() => this.#documentService.documents()
        .filter((document) => document.type === 'invoice')
        .map((model) => ({ model, state: { status: 'pending' } }))
    );

    get invoices(): Signal<Invoice[]> {
        return this.#invoices;
    }

    async viewInvoice(invoice: Invoice): Promise<void> {
        await this.#invoiceModalService.openInvoiceModal(invoice);
    }

    async createInvoices(customerMap: Map<string, number>, tokens: Tokens, defaults: Defaults): Promise<void> {
        this.#invoices.update((invoices) => invoices.map((invoice) => invoice.state.status !== 'created' ? { ...invoice, state: { status: 'creating' } } : invoice));
        const invoiceResults = this.#invoices()
            .filter((invoice) => invoice.state.status === 'creating')
            .map((invoice) => this.#createInvoice(invoice.model, customerMap, tokens, defaults)
                .then<Invoice, Invoice>(
                    () => ({ model: invoice.model, state: { status: 'created' } }),
                    (error) => ({ model: invoice.model, state: { status: 'error', errorMessage: error.message } })
                )
                .then((invoiceResult) => this.#invoices.update((invoices) => invoices.map((i) => i.model.id === invoiceResult.model.id ? invoiceResult : i)))
            );
        await Promise.all(invoiceResults);
    }

    async #createInvoice(invoice: InvoiceModel, customerMap: Map<string, number>, tokens: Tokens, defaults: Defaults): Promise<void> {
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