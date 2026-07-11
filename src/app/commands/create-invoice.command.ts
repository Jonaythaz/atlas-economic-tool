import type { CommandError } from '@atlas/errors';
import { parseError } from '@atlas/functions/parse-error';
import type { NewInvoice, Tokens } from '@atlas/models';
import { invoke } from '@tauri-apps/api/core';
import { type AsyncResult, Result } from 'typescript-result';

export function createInvoice(invoice: NewInvoice, tokens: Tokens): AsyncResult<number, CommandError> {
	return Result.try(() => invoke<number>('create_invoice', { invoice, tokens }), parseError);
}
