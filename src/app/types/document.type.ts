import type { CreditNoteDocument } from './credit-note-document.type';
import type { InvoiceDocument } from './invoice-document.type';

export type Document = InvoiceDocument | CreditNoteDocument;
