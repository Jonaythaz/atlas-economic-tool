import { NewInvoiceLine } from "./new-invoice-line.model";

export type NewInvoice = {
    date: string;
    layout: number;
    customer: number;
    recipient: string;
    paymentTerms: number;
    vatZone: number;
    reference?: string;
    lines: NewInvoiceLine[];
}