export type InvoiceBookingModel = {
	invoiceId: number;
	draftInvoiceId: number;
	customerType: 'business' | 'private';
};
