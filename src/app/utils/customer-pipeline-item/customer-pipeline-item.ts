import { createCustomer } from '@atlas/commands';
import type { Defaults, NewCustomer, Settings } from '@atlas/models';
import type { CreatedCustomer, Customer } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

export class CustomerPipelineItem extends PipelineItem<Customer, CreatedCustomer, Settings> {
	protected async processInternal(dependencies: Settings): Promise<CreatedCustomer> {
		const customer = this.input();
		const newCustomer = toNewCustomer(customer, dependencies.defaults);
		return createCustomer(newCustomer, dependencies.tokens).then((createdCustomer) => {
			if (createdCustomer.type === 'business') {
				return createdCustomer;
			}
			if (customer.type === 'business') {
				throw new Error('Created customer is a person but input customer is a business');
			}
			const email = createdCustomer.email;
			if (email === null) {
				throw new Error('External customer is missing email, please update the customer in e-conomic and try again');
			}
			return {
				...createdCustomer,
				cpr: customer.cpr,
				email,
			};
		});
	}
}

function toNewCustomer(customer: Customer, defaults: Defaults): NewCustomer {
	const id = customer.id;
	const group = customer.group ?? defaults.customerGroup;
	const vatZone = customer.vatZone ?? defaults.vatZone;
	const paymentTerms = customer.paymentTerms ?? defaults.paymentTerms;
	if (id === null || group === null || vatZone === null || paymentTerms === null) {
		throw new Error('Missing required fields');
	}
	if (customer.type === 'business') {
		return {
			...customer,
			id,
			group,
			vatZone,
			paymentTerms,
		};
	}
	const email = customer.email;
	if (email === null) {
		throw new Error('Missing required fields');
	}
	return {
		...customer,
		id,
		email,
		group,
		vatZone,
		paymentTerms,
	};
}
