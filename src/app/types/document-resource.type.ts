export type DocumentResource<T, R = T> = PendingResource<T> | LoadingResource<T> | ErroredResource<T> | CreatedResource<R>;

type PendingResource<T> = {
    model: T;
    status: 'pending';
};

type LoadingResource<T> = {
    model: T;
    status: 'loading';
};

type ErroredResource<T> = {
    model: T;
    status: 'error';
    message: string;
};

type CreatedResource<R> = {
    model: R;
    status: 'created';
};
