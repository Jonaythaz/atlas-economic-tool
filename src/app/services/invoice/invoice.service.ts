import { inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createInvoice } from "../../commands";
import { InvoiceModel, NewInvoice, Settings } from "../../models";
import { InvoiceModalService } from "../../modals/invoice";
import { InvoiceResource } from "../../types";
import { DocumentService } from "../document";
import { createResources } from "../../functions/create-resources";

@Injectable({ providedIn: 'root' })
export class InvoiceService {
    readonly #documentService = inject(DocumentService);
    readonly #invoiceModalService = inject(InvoiceModalService);

    readonly #invoices = linkedSignal<InvoiceResource[]>(() => this.#documentService.documents()
        .filter((document) => document.type === 'invoice')
        .map((model) => ({ model, status: 'pending' }))
    );

    get invoices(): Signal<InvoiceResource[]> {
        return this.#invoices;
    }

    async viewInvoice(invoice: InvoiceResource): Promise<void> {
        await this.#invoiceModalService.openInvoiceModal(invoice);
    }

    async createInvoices(settings: Settings, customerMap: Map<string, number>): Promise<void> {
        await createResources({
            resources: this.#invoices,
            createFn: (invoice) => this.#createInvoice(invoice, settings, customerMap),
            equalFn: (i1, i2) => i1.id === i2.id
        });
    }

    async #createInvoice(invoice: InvoiceModel, settings: Settings, customerMap: Map<string, number>): Promise<InvoiceModel> {
        const { layout, paymentTerms, vatZone } = settings.defaults;
        if (layout === undefined || paymentTerms === undefined || vatZone === undefined) {
            throw new Error('Missing default values for creating invoice.');
        }
        const customerId = customerMap.get(invoice.customer.id);
        if (customerId === undefined) {
            throw new Error(`Missing external ID for customer with ID ${invoice.customer.id}`);
        }
        const newInvoice = toNewInvoice(invoice, customerId, layout, paymentTerms, vatZone);
        await createInvoice(newInvoice, settings.tokens);
        return invoice;
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
            description: line.product.name,
            price: line.price,
            quantity: line.quantity,
        }))
    };
}