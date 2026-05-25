import { signal } from '@angular/core';
import { applyWhenValue, email, type FieldTree, form, readonly, required } from '@angular/forms/signals';
import type { Defaults } from '@atlas/models';
import type { BusinessCustomer, Customer, Defined, PrivateCustomer } from '@atlas/types';

export function customerForm(customer: Customer, defaults: Defaults): FieldTree<Defined<Customer>> {
	const model = signal(
		customer.type === 'business'
			? initializeBusinessCustomer(customer, defaults)
			: initializePrivateCustomer(customer, defaults),
	);
	return form(model, (schema) => {
		applyWhenValue(
			schema,
			(v) => v.type === 'business',
			(s) => readonly(s.ean),
		);
		applyWhenValue(
			schema,
			(v) => v.type === 'private',
			(s) => {
				readonly(s.cpr);
				required(s.email, { message: 'Email is required' });
				email(s.email, { message: 'Invalid email address' });
			},
		);
		readonly(schema.type);
		required(schema.id, { message: 'Customer ID is required' });
		required(schema.name, { message: 'Customer name is required' });
		required(schema.street, { message: 'Street is required' });
		required(schema.city, { message: 'City is required' });
		required(schema.postalCode, { message: 'Postal code is required' });
		required(schema.country, { message: 'Country is required' });
		required(schema.group, { message: 'Customer group is required' });
		required(schema.paymentTerms, { message: 'Payment terms is required' });
		required(schema.vatZone, { message: 'VAT zone is required' });
	});
}

function initializeBusinessCustomer(customer: BusinessCustomer, defaults?: Defaults): Defined<BusinessCustomer> {
	return {
		...customer,
		id: customer.id ?? NaN,
		group: customer.group ?? defaults?.customerGroup ?? NaN,
		vatZone: customer.vatZone ?? defaults?.vatZone ?? NaN,
		paymentTerms: customer.paymentTerms ?? defaults?.paymentTerms ?? NaN,
	};
}

function initializePrivateCustomer(customer: PrivateCustomer, defaults?: Defaults): Defined<PrivateCustomer> {
	return {
		...customer,
		id: customer.id ?? NaN,
		email: customer.email ?? '',
		group: customer.group ?? defaults?.customerGroup ?? NaN,
		vatZone: customer.vatZone ?? defaults?.vatZone ?? NaN,
		paymentTerms: customer.paymentTerms ?? defaults?.paymentTerms ?? NaN,
	};
}
