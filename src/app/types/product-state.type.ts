export type ProductState = Creating | Pending | Created | Error;

type Created = {
    status: 'created';
};

type Error = {
    status: 'error';
    errorMessage: string;
};

type Pending = {
    status: 'pending';
};

type Creating = {
    status: 'creating';
};