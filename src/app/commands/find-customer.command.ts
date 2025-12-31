import { parseError } from "@atlas/functions/parse-error";
import { invoke } from "@tauri-apps/api/core";

export function findCustomer(id: string): Promise<number | null> {
	return invoke<number | null>("find_customer", { id }).catch((error) => {
		throw parseError(error);
	});
}
