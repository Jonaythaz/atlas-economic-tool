export type CustomerState = Pending | Creating | Created | Error;

type Created = {
    status: 'created';
    externalId: number;
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
}