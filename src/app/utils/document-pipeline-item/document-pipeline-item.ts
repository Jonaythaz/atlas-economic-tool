import { createInvoice } from '@atlas/commands';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type {
	CustomerModel,
	DocumentLine,
	NewInvoice,
	NewInvoiceLine,
	NewInvoiceRecipient,
	ProductModel,
	Settings,
} from '@atlas/models';
import type { Document } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

type Dependencies = {
	customerMap: Map<string, CustomerModel>;
	productMap: Map<string, ProductModel>;
	settings: Settings;
};

export class DocumentPipelineItem extends PipelineItem<Document, unknown, Dependencies> {
	protected async processInternal(dependencies: Dependencies): Promise<unknown> {
		const newInvoice = toNewInvoice(this.input(), dependencies);
		return createInvoice(newInvoice, dependencies.settings.tokens);
	}
}

function toNewInvoice(document: Document, deps: Dependencies): NewInvoice {
	const customerKey = toCustomerMapKey(document.customer);
	const customer = deps.customerMap.get(customerKey);
	if (!customer) {
		throw new Error('Missing customer for invoice');
	}
	const { layout, paymentTerms } = deps.settings.defaults;
	if (layout === null || paymentTerms === null) {
		throw new Error('Missing default values');
	}
	return {
		layout,
		paymentTerms,
		customerId: customer.id,
		recipient: toNewInvoiceRecipient(customer),
		date: document.date,
		damageNumber: document.damageNumber,
		lines: document.lines.map((line) => toNewInvoiceLine(line, deps.productMap)),
	};
}

function toNewInvoiceRecipient(customer: CustomerModel): NewInvoiceRecipient {
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

function toNewInvoiceLine(line: DocumentLine, productMap: Map<string, ProductModel>): NewInvoiceLine {
	const product = productMap.get(line.productId);
	if (!product) {
		throw new Error('Missing product for line');
	}
	return {
		productId: product.id,
		description: product.name,
		price: line.price,
		quantity: line.quantity,
	};
}
