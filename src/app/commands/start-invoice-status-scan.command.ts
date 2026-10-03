import { parseError } from '@atlas/functions/parse-error';
import type { Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';

export async function startInvoiceStatusScan(tokens: Tokens): Promise<void> {
	return invoke<void>('start_invoice_status_scan', { tokens }).catch((error) => {
		throw parseError(error);
	});
}
