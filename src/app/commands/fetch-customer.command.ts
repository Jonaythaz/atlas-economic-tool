import { parseError } from "@atlas/functions/parse-error";
import type { CustomerModel, Tokens } from "@atlas/models";
import { invoke } from "@tauri-apps/api/core";

export function fetchCustomer(id: number, tokens: Tokens): Promise<CustomerModel | null> {
	return invoke<CustomerModel | null>("fetch_customer", { id, tokens }).catch((error) => {
		throw parseError(error);
	});
}
