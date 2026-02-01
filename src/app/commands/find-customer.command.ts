import { parseError } from "@atlas/functions/parse-error";
import { invoke } from "@tauri-apps/api/core";

export async function findCustomer(ean: string): Promise<number | null> {
	return invoke<number | null>("find_customer", { ean }).catch((error) => {
		throw parseError(error);
	});
}
