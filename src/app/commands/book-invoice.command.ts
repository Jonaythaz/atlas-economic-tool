import type { CommandError } from '@atlas/errors';
import { parseError } from '@atlas/functions/parse-error';
import type { InvoiceBookingModel, Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';
import { type AsyncResult, Result } from 'typescript-result';

export function bookInvoice(invoice: InvoiceBookingModel, tokens: Tokens): AsyncResult<void, CommandError> {
	return Result.fromAsyncCatching(async () => {
		await invoke('book_invoice', { invoice, tokens });
	}, parseError);
}
