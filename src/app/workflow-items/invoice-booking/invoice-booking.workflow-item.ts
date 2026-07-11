import { type Signal, signal, type WritableSignal } from '@angular/core';
import { bookInvoice } from '@atlas/commands';
import type { Settings } from '@atlas/models';
import type { InvoiceBookingModel } from '@atlas/models/invoice-booking.model';
import type { WorkflowState } from '@atlas/types';

export class InvoiceBookingWorkflowItem {
	readonly invoiceBooking: WritableSignal<InvoiceBookingModel>;
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);

	constructor(invoiceBooking: InvoiceBookingModel) {
		this.invoiceBooking = signal(invoiceBooking);
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<InvoiceBookingModel> {
		return this.invoiceBooking.asReadonly();
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	async create(settings: Settings): Promise<void> {
		if (this.#state() === 'completed') {
			return;
		}
		this.#state.set('running');

		const invoiceBooking = this.invoiceBooking();
		await bookInvoice(invoiceBooking, settings.tokens)
			.onSuccess(() => {
				this.#errorMessage.set(undefined);
				this.#state.set('completed');
			})
			.onFailure((error) => {
				this.#errorMessage.set(error.message);
				this.#state.set('failed');
			});
	}
}
