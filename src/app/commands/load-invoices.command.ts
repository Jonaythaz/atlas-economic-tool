import { invoke } from "@tauri-apps/api/core";
import { Invoice } from "../models";

export async function loadInvoices(): Promise<Invoice[]> {
    return invoke<Invoice[]>("load_invoices").catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}