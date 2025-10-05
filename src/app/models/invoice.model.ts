import { Customer } from "./customer.model";
import { InvoiceLine } from "./invoice-line.model";

export type Invoice = {
    id: string;
    date: string;
    damageNumber?: string;
    customer: Customer;
    recipient: string;
    lines: InvoiceLine[];
};