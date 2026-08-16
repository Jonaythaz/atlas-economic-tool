import type { InvoiceAction, InvoiceActionSegmentItem } from '@atlas/types';

export const INVOICE_ACTION_SEGMENTS: Record<InvoiceAction, InvoiceActionSegmentItem> = {
	draft: { id: 'draft', text: 'Draft' },
	book: { id: 'book', text: 'Book' },
	send: { id: 'send', text: 'Send' },
};
