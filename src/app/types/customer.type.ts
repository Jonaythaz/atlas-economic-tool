import { CustomerState } from "./customer-state.type";

export type Customer = {
    id: string;
    name: string;
    group?: number;
    vatZone?: number;
    paymentTerms?: number;
    state: CustomerState;
};