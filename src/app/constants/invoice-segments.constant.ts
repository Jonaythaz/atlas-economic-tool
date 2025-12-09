import { SegmentItem } from "@kirbydesign/designsystem";
import { InvoiceSegment } from "../types";

export const INVOICE_SEGMENTS: Record<InvoiceSegment, SegmentItem> = {
    [InvoiceSegment.Invoices]: {
        id: InvoiceSegment.Invoices,
        text: 'Invoices',
    },
    [InvoiceSegment.Customers]: {
        id: InvoiceSegment.Customers,
        text: 'Customers',
    },
    [InvoiceSegment.Products]: {
        id: InvoiceSegment.Products,
        text: 'Products',
    },
};