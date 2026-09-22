import { Injectable, inject, type Signal, signal } from '@angular/core';
import { checkIfInvoiceIsBooked } from '@atlas/commands';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type { DocumentModel, Settings } from '@atlas/models';
import type { BillingDocument, BillingRecipient, CreatedCustomer, CreatedProduct, WorkflowState } from '@atlas/types';
import { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import { combineLatestWith } from 'rxjs';

import { EventBusService } from '../event-bus';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
	readonly #eventBus = inject(EventBusService);

	readonly #state = signal<WorkflowState>('idle');
	readonly #invoices = signal<InvoiceWorkflowItem[]>([]);
	readonly #settings = signal<Settings | null>(null);

	constructor() {
		this.#eventBus.documentsEvents
			.pipe(
				combineLatestWith(
					this.#eventBus.customerMapEvents,
					this.#eventBus.productMapEvents,
					this.#eventBus.settingsEvents,
				),
			)
			.subscribe(async ([documents, customerMap, productMap, settings]) => {
				this.#state.set('blocked');
				this.#settings.set(settings);
				this.#invoices.set(
					await Promise.all(
						documents.documents
							.sort((a, b) => a.id - b.id)
							.map(async (document) => {
								const status = await checkIfInvoiceIsBooked(document.id, settings.tokens)
									.map((isAlreadyBooked) =>
										isAlreadyBooked ? { type: 'booked' as const } : { type: 'local' as const },
									)
									.getOrElse(() => ({ type: 'local' as const }));
								return new InvoiceWorkflowItem(toBillingDocument(document, customerMap, productMap, settings), status);
							}),
					),
				);
			});
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get invoices(): Signal<InvoiceWorkflowItem[]> {
		return this.#invoices.asReadonly();
	}

	async createInvoices(): Promise<void> {
		const settings = this.#settings();
		if (!settings) {
			throw new Error('No settings');
		}
		this.#state.set('running');
		await Promise.all(
			this.#invoices()
				.filter((invoice) => invoice.selected())
				.map((invoice) => invoice.create(settings)),
		).then(() => {
			this.#state.update(this.#determineState.bind(this));
		});
	}

	async createInvoice(item: InvoiceWorkflowItem): Promise<void> {
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

function toBillingDocument(
	document: DocumentModel,
	customerMap: Map<string, CreatedCustomer>,
	productMap: Map<string, CreatedProduct>,
	settings: Settings,
): BillingDocument {
	const customer = customerMap.get(toCustomerMapKey(document.customer));
	const defaults = settings.defaults;
	const common = {
		id: document.id,
		customerId: customer?.id ?? 0,
		date: document.date,
		layout: defaults.layout ?? 0,
		paymentTerms: customer?.paymentTerms ?? defaults.paymentTerms ?? 0,
		damageNumber: document.damageNumber ?? '',
		currency: 'DKK',
		recipient: toBillingRecipient(customer, defaults.vatZone ?? 0),
		lines: document.lines.map((line, index) => {
			const product = productMap.get(line.productId);
			return {
				id: product?.id ?? line.productId,
				name: product?.name ?? `Line ${index + 1}`,
				description: line.description,
				quantity: line.quantity,
				price: line.price,
				discount: line.discount ?? 0,
				totalPrice: line.quantity * (line.price - (line.discount ?? 0)),
			};
		}),
	};
	return document.type === 'credit-note'
		? { ...common, type: 'credit-note', invoiceId: document.invoiceId }
		: { ...common, type: 'invoice' };
}

function toBillingRecipient(customer: CreatedCustomer | undefined, defaultVatNumber: number): BillingRecipient {
	if (!customer) {
		return {
			type: 'business',
			name: '',
			ean: '',
			street: '',
			city: '',
			postalCode: '',
			country: '',
			vatNumber: defaultVatNumber,
		};
	}
	return customer.type === 'business'
		? {
				type: 'business',
				name: customer.name,
				ean: customer.ean,
				street: customer.street,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
				vatNumber: customer.vatZone,
			}
		: {
				type: 'private',
				name: customer.name,
				email: customer.email,
				street: customer.street,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
				vatNumber: customer.vatZone,
			};
}

const STATE_PRIORITY: Record<WorkflowState, number> = {
	failed: 1,
	blocked: 2,
	idle: 3,
	running: 4,
	completed: 5,
};
