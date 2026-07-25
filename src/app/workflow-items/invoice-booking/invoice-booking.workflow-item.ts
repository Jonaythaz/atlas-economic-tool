import { type Signal, signal, type WritableSignal } from '@angular/core';
import { bookInvoice } from '@atlas/commands';
import type { Settings } from '@atlas/models';
import type { InvoiceBooking, WorkflowState } from '@atlas/types';

export class InvoiceBookingWorkflowItem {
	readonly invoiceBooking: WritableSignal<InvoiceBooking>;
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);
	readonly #selected = signal(true);
	readonly #send = signal(true);

	constructor(invoiceBooking: InvoiceBooking) {
		this.invoiceBooking = signal(invoiceBooking);
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<InvoiceBooking> {
		return this.invoiceBooking.asReadonly();
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	get selected(): WritableSignal<boolean> {
		return this.#selected;
	}

	get send(): WritableSignal<boolean> {
		return this.#send;
	}

	async create(settings: Settings): Promise<void> {
		if (this.#state() === 'completed') {
			return;
		}
		this.#state.set('running');

		const invoiceBooking = this.invoiceBooking();
		await bookInvoice({ ...invoiceBooking, skipSend: !this.#send() }, settings.tokens)
			.onSuccess(() => {
				this.#errorMessage.set(undefined);
				this.#state.set('completed');
				this.#selected.set(false);
			})
			.onFailure((error) => {
				this.#errorMessage.set(error.message);
				this.#state.set('failed');
			});
	}
}
