import { type Signal, signal, type WritableSignal } from '@angular/core';
import { bookInvoice, checkIfInvoiceIsBooked, createInvoice } from '@atlas/commands';
import { type CommandError, WorkflowError } from '@atlas/errors';
import type { NewInvoice, NewInvoiceLine, NewInvoiceRecipient, Settings } from '@atlas/models';
import type {
	BillingDocument,
	BillingLine,
	CreatedCustomer,
	InvoiceAction,
	InvoiceBooking,
	WorkflowState,
} from '@atlas/types';
import type { InvoiceStatus } from '@atlas/types/invoice-status.type';
import { type AsyncResult, Result } from 'typescript-result';

export class InvoiceWorkflowItem {
	readonly #value: WritableSignal<BillingDocument>;
	readonly #status: WritableSignal<InvoiceStatus>;
	readonly #action = signal<InvoiceAction>('send');
	readonly #selected = signal(true);
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);

	constructor(value: BillingDocument, status: InvoiceStatus) {
		this.#value = signal(value);
		this.#status = signal(status);
		if (status.type === 'booked') {
			this.#state.set('completed');
		}
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<BillingDocument> {
		return this.#value.asReadonly();
	}

	get action(): WritableSignal<InvoiceAction> {
		return this.#action;
	}

	get selected(): WritableSignal<boolean> {
		return this.#selected;
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	async create(settings: Settings): Promise<void> {
		const status = this.#status();
		if (status.type === 'booked') {
			return;
		}
		this.#state.set('running');

		const value = this.#value();
		const action = this.#action();

		await Result.fromAsync(async () =>
			status.type === 'local'
				? await draftInvoice(value, settings).onSuccess((status) => {
						this.#status.set(status);
					})
				: Result.ok(status),
		)
			.map((status) => {
				if (status.type !== 'draft' || action === 'draft') {
					return Result.ok(status);
				}
				return performInvoiceBooking(status.bookingInfo, action === 'book', settings);
			})
			.onSuccess((status) => {
				this.#status.set(status);
				this.#state.set('completed');
			})
			.onFailure((error) => {
				this.#errorMessage.set(error.message);
				this.#state.set(error.type === 'workflow-error' ? error.severity : 'failed');
			})
			.getOrThrow();
	}
}

function draftInvoice(
	value: BillingDocument,
	settings: Settings,
): AsyncResult<InvoiceStatus, CommandError | WorkflowError> {
	const newInvoice = toNewInvoice(value, settings);
	if (!newInvoice.ok) {
		return Result.fromAsync(async () => Result.error(new WorkflowError('blocked', newInvoice.error)));
	}
	return createInvoice(newInvoice.value, settings.tokens).map((draftId) => ({
		type: 'draft' as const,
		bookingInfo: {
			invoiceId: value.id,
			draftInvoiceId: draftId,
			customerType: newInvoice.value.recipient.type,
		},
	}));
}

function performInvoiceBooking(
	bookingInfo: InvoiceBooking,
	skipSend: boolean,
	settings: Settings,
): AsyncResult<InvoiceStatus, CommandError> {
	return bookInvoice({ ...bookingInfo, skipSend }, settings.tokens).map(() => ({
		type: 'booked' as const,
	}));
}

function toNewInvoice(value: BillingDocument, settings: Settings): Result<NewInvoice, string> {
	const customer = value.customer;
	if (customer === null) {
		return Result.error('Missing customer for invoice');
	}
	const { layout, paymentTerms } = settings.defaults;
	if (layout === null || paymentTerms === null) {
		return Result.error('Missing default values');
	}
	return Result.all(...value.lines.map((line) => toNewInvoiceLine(line))).map((lines) => ({
		layout,
		paymentTerms,
		customerId: customer.id,
		recipient: toNewInvoiceRecipient(customer),
		date: value.date,
		damageNumber: value.damageNumber,
		lines,
	}));
}

function toNewInvoiceRecipient(customer: CreatedCustomer): NewInvoiceRecipient {
	return customer.type === 'business'
		? {
				type: 'business',
				ean: customer.ean,
				name: customer.name,
				street: customer.street,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
				vatZone: customer.vatZone,
			}
		: {
				type: 'private',
				name: customer.name,
				street: customer.street,
				city: customer.city,
				postalCode: customer.postalCode,
				country: customer.country,
				vatZone: customer.vatZone,
			};
}

function toNewInvoiceLine(line: BillingLine): Result<NewInvoiceLine, string> {
	const product = line.product;
	if (!product) {
		return Result.error('Missing product for line');
	}
	return Result.ok({
		productId: product.id,
		description: line.description,
		price: line.price,
		quantity: line.quantity,
		discount: line.discount,
	});
}
