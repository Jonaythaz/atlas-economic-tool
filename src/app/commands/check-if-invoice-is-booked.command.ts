import type { CommandError } from '@atlas/errors';
import { parseError } from '@atlas/functions/parse-error';
import type { Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';
import { type AsyncResult, Result } from 'typescript-result';

export function checkIfInvoiceIsBooked(id: number, tokens: Tokens): AsyncResult<boolean, CommandError> {
	return Result.fromAsyncCatching(
		async () => invoke<boolean>('check_if_invoice_is_booked', { id, tokens }),
		parseError,
	);
}
