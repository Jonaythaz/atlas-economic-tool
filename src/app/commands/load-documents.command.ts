import { invoke } from "@tauri-apps/api/core";
import { DocumentModel } from "../models";
import { parseError } from "../functions/parse-error";

export async function loadDocuments(): Promise<DocumentModel[]> {
    return invoke<DocumentModel[]>("load_documents").catch((error) => {
        throw parseError(error);
    });
}