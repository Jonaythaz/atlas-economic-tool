import { invoke } from "@tauri-apps/api/core";
import { NewInvoice, Tokens } from "../models";
import { parseError } from "../functions/parse-error";


export async function createInvoice(invoice: NewInvoice, tokens: Tokens): Promise<void> {
    await invoke("create_invoice", { invoice, tokens }).catch((error) => {
        throw parseError(error);
    });
}