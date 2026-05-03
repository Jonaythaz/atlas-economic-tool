import { createCustomer } from '@atlas/commands';
import type { CreatedCustomerModel, Defaults, NewCustomer, Settings } from '@atlas/models';
import type { Customer } from '@atlas/types';
import { PipelineItem } from '@atlas/utils/pipeline-item';

export class CustomerPipelineItem extends PipelineItem<Customer, CreatedCustomerModel, Settings> {
	protected async processInternal(dependencies: Settings): Promise<CreatedCustomerModel> {
		const newCustomer = toNewCustomer(this.input(), dependencies.defaults);
		return createCustomer(newCustomer, dependencies.tokens);
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
