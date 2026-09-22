import { linkedSignal } from '@angular/core';
import { applyEach, type FieldTree, form, readonly, required } from '@angular/forms/signals';
import type { BillingDocument } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';

export function invoiceForm(
	invoiceFn: () => InvoiceWorkflowItem,
): FieldTree<BillingDocument> {
	const model = linkedSignal(() => invoiceFn().value());
	return form(model, (schema) => {
		required(schema.date, { message: 'date is required' });
		required(schema.layout, { message: 'layout is required' });
		readonly(schema.type);
		readonly(schema.id);
		readonly(schema.customerId);
		readonly(schema.paymentTerms);
		readonly(schema.damageNumber);
		readonly(schema.currency);
		readonly(schema.recipient.type);
		readonly(schema.recipient.name);
		readonly(schema.recipient.street);
		readonly(schema.recipient.city);
		readonly(schema.recipient.postalCode);
		readonly(schema.recipient.country);
		readonly(schema.recipient.vatNumber);
		applyEach(schema.lines, (line) => {
			readonly(line.name);
			readonly(line.id);
			readonly(line.quantity);
			readonly(line.price);
			readonly(line.discount);
			readonly(line.totalPrice);
		});
	});
}
