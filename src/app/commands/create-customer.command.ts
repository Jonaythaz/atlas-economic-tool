import { parseError } from "@atlas/functions/parse-error";
import type { NewCustomer, Tokens } from "@atlas/models";
import { invoke } from "@tauri-apps/api/core";

export async function createCustomer(localId: string, newCustomer: NewCustomer, tokens: Tokens): Promise<number> {
	return invoke<number>("create_customer", {
		request: { localId, newCustomer, tokens },
	}).catch((error) => {
		throw parseError(error);
	});
}
