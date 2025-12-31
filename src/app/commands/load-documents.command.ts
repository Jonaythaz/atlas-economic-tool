import { parseError } from "@atlas/functions/parse-error";
import type { DocumentModel } from "@atlas/models";
import { invoke } from "@tauri-apps/api/core";

export async function loadDocuments(): Promise<DocumentModel[]> {
	return invoke<DocumentModel[]>("load_documents").catch((error) => {
		throw parseError(error);
	});
}
