import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";
import type { NewCustomer, Tokens } from "../models";

export async function createCustomer(localId: string, newCustomer: NewCustomer, tokens: Tokens): Promise<number> {
	return invoke<number>("create_customer", {
		request: { localId, newCustomer, tokens },
	}).catch((error) => {
		throw parseError(error);
	});
}
