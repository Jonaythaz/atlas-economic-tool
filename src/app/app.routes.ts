import type { Routes } from '@angular/router';
import { InvoicePageComponent } from '@atlas/pages/invoice';
import { InvoiceBookingComponent } from '@atlas/pages/invoice-booking';

import { invoiceResolver } from './resolvers/invoice';
import { settingsResolver } from './resolvers/settings';

export const routes: Routes = [
	{
		path: '',
		redirectTo: '/booking',
		pathMatch: 'full',
	},
	{ path: 'booking', component: InvoiceBookingComponent },
	{
		path: 'invoice/:id',
		component: InvoicePageComponent,
		resolve: {
			invoice: invoiceResolver,
			settings: settingsResolver,
		},
	},
];
