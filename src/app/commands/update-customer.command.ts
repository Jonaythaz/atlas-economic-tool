import { parseError } from "@atlas/functions/parse-error";
import { invoke } from "@tauri-apps/api/core";

export async function updateCustomer(id: string, externalId: number): Promise<void> {
	await invoke("update_customer", { request: { id, externalId } }).catch((error) => {
		throw parseError(error);
	});
}
