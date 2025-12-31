import { parseError } from "@atlas/functions/parse-error";
import type { NewInvoice, Tokens } from "@atlas/models";
import { invoke } from "@tauri-apps/api/core";

export async function createInvoice(invoice: NewInvoice, tokens: Tokens): Promise<void> {
	await invoke("create_invoice", { invoice, tokens }).catch((error) => {
		throw parseError(error);
	});
}
