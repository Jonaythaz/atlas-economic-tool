import { Injectable, inject, linkedSignal, type Signal } from "@angular/core";
import { createInvoice } from "@atlas/commands";
import { DocumentService } from "@atlas/document";
import { createResources } from "@atlas/functions/create-resources";
import { CreditNoteModalService } from "@atlas/modals/credit-note";
import type { CreditNoteModel, NewInvoice, Settings } from "@atlas/models";
import type { CreditNoteResource } from "@atlas/types";

@Injectable({ providedIn: "root" })
export class CreditNoteService {
	readonly #documentService = inject(DocumentService);
	readonly #creditNoteModalService = inject(CreditNoteModalService);

	readonly #creditNotes = linkedSignal<CreditNoteResource[]>(() =>
		this.#documentService
			.documents()
			.filter((document) => document.type === "credit-note")
			.map((model) => ({ model, status: "pending" })),
	);

	get creditNotes(): Signal<CreditNoteResource[]> {
		return this.#creditNotes;
	}

	async viewCreditNote(creditNote: CreditNoteResource): Promise<void> {
		await this.#creditNoteModalService.openCreditNoteModal(creditNote);
	}

	async createCreditNotes(settings: Settings, customerMap: Map<string, number>): Promise<void> {
		await createResources({
			resources: this.#creditNotes,
			createFn: (creditNote) => this.#createCreditNote(creditNote, customerMap, settings),
			equalFn: (cn1, cn2) => cn1.id === cn2.id,
		});
	}

	async #createCreditNote(
		creditNote: CreditNoteModel,
		customerMap: Map<string, number>,
		settings: Settings,
	): Promise<CreditNoteModel> {
		const { layout, paymentTerms, vatZone } = settings.defaults;
		if (layout === undefined || paymentTerms === undefined || vatZone === undefined) {
			throw new Error("Missing default values for creating creditNote.");
		}
		const customerId = customerMap.get(creditNote.customer.id);
		if (customerId === undefined) {
			return Promise.reject(new Error(`Missing external ID for customer with ID ${creditNote.customer.id}`));
		}
		const newCreditNote = toNewInvoice(creditNote, customerId, layout, paymentTerms, vatZone);
		await createInvoice(newCreditNote, settings.tokens);
		return creditNote;
	}
}

function toNewInvoice(
	creditNote: CreditNoteModel,
	customer: number,
	layout: number,
	paymentTerms: number,
	vatZone: number,
): NewInvoice {
	return {
		layout,
		customer,
		date: creditNote.date,
		recipient: creditNote.customer.name,
		paymentTerms: paymentTerms,
		vatZone: vatZone,
		damageNumber: creditNote.damageNumber,
		lines: creditNote.lines.map((line) => ({
			product: line.product.id,
			description: line.product.name,
			price: line.price,
			quantity: -Math.abs(line.quantity),
		})),
	};
}
