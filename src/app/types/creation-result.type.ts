export type CreationResult<T> = Success<T> | Failure;

type Success<T> = {
	type: 'success';
	data: T;
};

type Failure = {
	type: 'failure';
	error: Error;
};
