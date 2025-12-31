import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";
import type { DocumentModel } from "../models";

export async function loadDocuments(): Promise<DocumentModel[]> {
	return invoke<DocumentModel[]>("load_documents").catch((error) => {
		throw parseError(error);
	});
}
