import { InvoiceCustomer } from "./invoice-customer.model";
import { InvoiceLine } from "./invoice-line.model";

export type InvoiceModel = {
    id: string;
    date: string;
    damageNumber?: string;
    customer: InvoiceCustomer;
    recipient: string;
    lines: InvoiceLine[];
};