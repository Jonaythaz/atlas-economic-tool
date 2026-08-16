import type { InvoiceBooking } from './invoice-booking.type';

export type InvoiceStatus = Booked | Draft | Local;

type Booked = {
	type: 'booked';
};

type Draft = {
	type: 'draft';
	bookingInfo: InvoiceBooking;
};

type Local = {
	type: 'local';
};
