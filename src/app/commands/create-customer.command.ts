import { parseError } from '@atlas/functions/parse-error';
import type { CustomerModel, NewCustomer, Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';

export async function createCustomer(customer: NewCustomer, tokens: Tokens): Promise<CustomerModel> {
	return invoke<CustomerModel>('create_customer', { customer, tokens }).catch((error) => {
		throw parseError(error);
	});
}
