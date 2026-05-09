import { createInvoice } from '@atlas/commands';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type { DocumentLine, NewInvoice, NewInvoiceLine, NewInvoiceRecipient, Settings } from '@atlas/models';
import type { CreatedCustomer, CreatedProduct, Document } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

type Dependencies = {
	customerMap: Map<string, CreatedCustomer>;
	productMap: Map<string, CreatedProduct>;
	settings: Settings;
};

export class DocumentPipelineItem extends PipelineItem<Document, void, Dependencies> {
	protected async processInternal(dependencies: Dependencies): Promise<void> {
		const newInvoice = toNewInvoice(this.input(), dependencies);
		await createInvoice(newInvoice, dependencies.settings.tokens);
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

function toNewInvoiceLine(line: DocumentLine, productMap: Map<string, CreatedProduct>): NewInvoiceLine {
	const product = productMap.get(line.productId);
	if (!product) {
		throw new Error('Missing product for line');
	}
	return {
		productId: product.id,
		description: product.description,
		price: line.price,
		quantity: line.quantity,
	};
}
