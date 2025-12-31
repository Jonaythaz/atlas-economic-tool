import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";

export function findCustomer(id: string): Promise<number | null> {
	return invoke<number | null>("find_customer", { id }).catch((error) => {
		throw parseError(error);
	});
}
