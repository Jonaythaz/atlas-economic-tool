export type InvoiceBooking = {
	invoiceId: number;
	draftInvoiceId: number;
	customerType: 'business' | 'private';
};
