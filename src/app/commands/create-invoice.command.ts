import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";
import type { NewInvoice, Tokens } from "../models";

export async function createInvoice(invoice: NewInvoice, tokens: Tokens): Promise<void> {
	await invoke("create_invoice", { invoice, tokens }).catch((error) => {
		throw parseError(error);
	});
}
