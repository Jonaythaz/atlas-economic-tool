export function parseError(error: unknown): Error {
    if (typeof error === 'string') {
        return new Error(error);
    }
    if (error instanceof Error) {
        return error;
    }
    return new Error('Was unable to parse error.');
}