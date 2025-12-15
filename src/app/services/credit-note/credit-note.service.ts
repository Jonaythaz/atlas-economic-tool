import { inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createInvoice } from "../../commands";
import { Defaults, CreditNoteModel, NewInvoice, Tokens } from "../../models";
import { CreditNoteModalService } from "../../modals/credit-note";
import { CreditNote } from "../../types";
import { DocumentService } from "../document";

@Injectable({ providedIn: 'root' })
export class CreditNoteService {
    readonly #documentService = inject(DocumentService);
    readonly #creditNoteModalService = inject(CreditNoteModalService);

    readonly #creditNotes = linkedSignal<CreditNote[]>(() => this.#documentService.documents()
        .filter((document) => document.type === 'credit-note')
        .map((model) => ({ model, state: { status: 'pending' } }))
    );

    get creditNotes(): Signal<CreditNote[]> {
        return this.#creditNotes;
    }

    async viewCreditNote(creditNote: CreditNote): Promise<void> {
        await this.#creditNoteModalService.openCreditNoteModal(creditNote);
    }
    
    async createCreditNotes(customerMap: Map<string, number>, tokens: Tokens, defaults: Defaults): Promise<void> {
        this.#creditNotes.update((creditNotes) => creditNotes.map((creditNote) => creditNote.state.status !== 'created' ? { ...creditNote, state: { status: 'creating' } } : creditNote));
        const creditNoteResults = this.#creditNotes()
            .filter((creditNote) => creditNote.state.status === 'creating')
            .map((creditNote) => this.#createCreditNote(creditNote.model, customerMap, tokens, defaults)
                .then<CreditNote, CreditNote>(
                    () => ({ model: creditNote.model, state: { status: 'created' } }),
                    (error) => ({ model: creditNote.model, state: { status: 'error', errorMessage: error.message } })
                )
                .then((creditNoteResult) => this.#creditNotes.update((creditNotes) => creditNotes.map((cn) => cn.model.id === creditNoteResult.model.id ? creditNoteResult : cn)))
            );
        await Promise.all(creditNoteResults);
    }

    async #createCreditNote(creditNote: CreditNoteModel, customerMap: Map<string, number>, tokens: Tokens, defaults: Defaults): Promise<void> {
        const { layout, paymentTerms, vatZone } = defaults;
        if (layout === undefined || paymentTerms === undefined || vatZone === undefined) {
            throw new Error('Missing default values for creating creditNote.');
        }
        const customerId = customerMap.get(creditNote.customer.id);
        if (customerId === undefined) {
            return Promise.reject(new Error(`Missing external ID for customer with ID ${creditNote.customer.id}`));
        }
        const newCreditNote = toNewInvoice(creditNote, customerId, layout, paymentTerms, vatZone);
        await createInvoice(newCreditNote, tokens.secret, tokens.grant);
    }
}

function toNewInvoice(creditNote: CreditNoteModel, customer: number, layout: number, paymentTerms: number, vatZone: number): NewInvoice {
    return {
        layout,
        customer,
        date: creditNote.date,
        recipient: creditNote.customer.name,
        paymentTerms: paymentTerms,
        vatZone: vatZone,
        reference: creditNote.invoiceId,
        lines: creditNote.lines.map((line) => ({
            product: line.product.id,
            price: line.price,
            quantity: -Math.abs(line.quantity),
        }))
    };
}