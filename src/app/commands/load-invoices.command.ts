import { invoke } from "@tauri-apps/api/core";
import { InvoiceModel } from "../models";

export async function loadInvoices(): Promise<InvoiceModel[]> {
    return invoke<InvoiceModel[]>("load_invoices").catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}