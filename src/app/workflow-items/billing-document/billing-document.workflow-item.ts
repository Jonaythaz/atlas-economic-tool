import { type Signal, signal, type WritableSignal } from '@angular/core';
import { createInvoice } from '@atlas/commands';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type { NewInvoice, NewInvoiceLine, NewInvoiceRecipient, Settings } from '@atlas/models';
import type {
	BillingDocument,
	BillingLine,
	CreatedCustomer,
	CreatedProduct,
	InvoiceBooking,
	WorkflowState,
} from '@atlas/types';
import { Result } from 'typescript-result';

export class BillingDocumentWorkflowItem {
	readonly #billingDocument: WritableSignal<BillingDocument>;
	readonly #state = signal<WorkflowState>('idle');
	readonly #errorMessage = signal<string | undefined>(undefined);
	readonly #readyInvoice = signal<InvoiceBooking | null>(null);

	constructor(billingDocument: BillingDocument) {
		this.#billingDocument = signal(billingDocument);
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}

	get value(): Signal<BillingDocument> {
		return this.#billingDocument.asReadonly();
	}

	get errorMessage(): Signal<string | undefined> {
		return this.#errorMessage.asReadonly();
	}

	async create(
		customerMap: Map<string, CreatedCustomer>,
		productMap: Map<string, CreatedProduct>,
		settings: Settings,
	): Promise<InvoiceBooking> {
		const readyInvoice = this.#readyInvoice();
		if (readyInvoice !== null) {
			return readyInvoice;
		}
		this.#state.set('running');

		const billingDocument = this.#billingDocument();
		const newInvoice = toNewInvoice(billingDocument, customerMap, productMap, settings);

		if (!newInvoice.ok) {
			this.#state.set('blocked');
			this.#errorMessage.set(newInvoice.error);
			throw new Error(newInvoice.error);
		}

		return createInvoice(newInvoice.value, settings.tokens)
			.map((draftId) => ({
				invoiceId: billingDocument.id,
				draftInvoiceId: draftId,
				customerType: billingDocument.customer.type,
			}))
			.onSuccess((invoice) => {
				this.#readyInvoice.set(invoice);
				this.#state.set('completed');
			})
			.onFailure((error) => {
				this.#errorMessage.set(error.message);
				this.#state.set('failed');
			})
			.getOrThrow();
	}
}

function toNewInvoice(
	billingDocument: BillingDocument,
	customerMap: Map<string, CreatedCustomer>,
	productMap: Map<string, CreatedProduct>,
	settings: Settings,
): Result<NewInvoice, string> {
	const customerKey = toCustomerMapKey(billingDocument.customer);
	const customer = customerMap.get(customerKey);
	if (!customer) {
		return Result.error('Missing customer for invoice');
	}
	const { layout, paymentTerms } = settings.defaults;
	if (layout === null || paymentTerms === null) {
		return Result.error('Missing default values');
	}
	return Result.all(...billingDocument.lines.map((line) => toNewInvoiceLine(line, productMap))).map((lines) => ({
		layout,
		paymentTerms,
		customerId: customer.id,
		recipient: toNewInvoiceRecipient(customer),
		date: billingDocument.date,
		damageNumber: billingDocument.damageNumber,
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

function toNewInvoiceLine(line: BillingLine, productMap: Map<string, CreatedProduct>): Result<NewInvoiceLine, string> {
	const product = productMap.get(line.productId);
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
