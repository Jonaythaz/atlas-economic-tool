import { CommandError } from '@atlas/errors';

export function parseError(error: unknown): CommandError {
	if (typeof error === 'string') {
		return new CommandError(error);
	}
	if (error instanceof Error) {
		return new CommandError(error.message, { cause: error });
	}
	return new CommandError('Unparsable error received.', { cause: error });
}
