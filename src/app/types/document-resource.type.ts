export type DocumentResource<T> = PendingResource<T> | LoadingResource<T> | ErroredResource<T> | CreatedResource<T>;

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

type CreatedResource<T> = {
    model: T;
    status: 'created';
};
