import { parseError } from '@atlas/functions/parse-error';
import type { CreatedCustomerModel, NewCustomer, Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';

export async function createCustomer(customer: NewCustomer, tokens: Tokens): Promise<CreatedCustomerModel> {
	return invoke<CreatedCustomerModel>('create_customer', { customer, tokens }).catch((error) => {
		throw parseError(error);
	});
}
