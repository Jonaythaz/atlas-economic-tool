import { invoke } from "@tauri-apps/api/core";
import { NewInvoice } from "../models";


export async function createInvoice(invoice: NewInvoice, secret: string, grant: string): Promise<void> {
    await invoke("create_invoice", { invoice, secret, grant }).catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}