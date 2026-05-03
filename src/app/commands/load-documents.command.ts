import { parseError } from '@atlas/functions/parse-error';
import type { Documents } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';

export async function loadDocuments(): Promise<Documents> {
	return invoke<Documents>('load_documents').catch((error) => {
		throw parseError(error);
	});
}
