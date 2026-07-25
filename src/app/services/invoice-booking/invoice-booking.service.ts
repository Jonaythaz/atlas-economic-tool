import { Injectable, inject, type Signal, signal } from '@angular/core';
import type { Settings } from '@atlas/models';
import type { WorkflowState } from '@atlas/types';
import { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import { combineLatestWith, map } from 'rxjs';

import { EventBusService } from '../event-bus';

@Injectable({ providedIn: 'root' })
export class InvoiceBookingService {
	readonly #eventBus = inject(EventBusService);

	readonly #invoices = signal<InvoiceBookingWorkflowItem[]>([]);
	readonly #settings = signal<Settings | null>(null);
	readonly #state = signal<WorkflowState>('idle');

	constructor() {
		this.#eventBus.invoicesEvents
			.pipe(
				map((invoices) => invoices.map((invoice) => new InvoiceBookingWorkflowItem(invoice))),
				combineLatestWith(this.#eventBus.settingsEvents),
			)
			.subscribe(([invoices, settings]) => {
				this.#invoices.set(invoices.sort((a, b) => a.value().draftInvoiceId - b.value().draftInvoiceId));
				this.#settings.set(settings);
				this.#state.set('blocked');
			});
	}

	get invoices(): Signal<InvoiceBookingWorkflowItem[]> {
		return this.#invoices;
	}

	get state(): Signal<WorkflowState> {
		return this.#state;
	}

	async bookInvoices(skipSend: boolean): Promise<void> {
		const settings = this.#settings();
		if (!settings) {
			throw new Error('No settings');
		}
		this.#state.set('running');
		await Promise.all(
			this.#invoices()
				.filter((invoice) => invoice.selected())
				.map((invoice) => invoice.create(settings, skipSend)),
		).then(() => {
			this.#state.update(this.#determineState.bind(this));
		});
	}

	async bookInvoice(item: InvoiceBookingWorkflowItem): Promise<void> {
		const settings = this.#settings();
		if (!settings) {
			throw new Error('No settings');
		}
		this.#state.set('running');
		await item.create(settings).then(() => {
			this.#state.update(this.#determineState.bind(this));
		});
	}

	#determineState(currentState: WorkflowState): WorkflowState {
		return this.#invoices().reduce((prev, item) => {
			const itemState = item.state();
			return STATE_PRIORITY[prev] < STATE_PRIORITY[itemState] ? prev : itemState;
		}, currentState);
	}
}

const STATE_PRIORITY: Record<WorkflowState, number> = {
	failed: 1,
	blocked: 2,
	idle: 3,
	running: 4,
	completed: 5,
};
