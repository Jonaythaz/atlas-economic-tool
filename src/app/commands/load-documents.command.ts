import { invoke } from "@tauri-apps/api/core";
import { DocumentModel } from "../models";

export async function loadDocuments(): Promise<DocumentModel[]> {
    return invoke<DocumentModel[]>("load_documents").catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}