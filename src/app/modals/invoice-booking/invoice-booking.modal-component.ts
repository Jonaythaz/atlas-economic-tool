import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { InvoiceListComponent } from '@atlas/components/invoice-list';
import { InvoiceBookingService } from '@atlas/services/invoice-booking';
import type { WorkflowState } from '@atlas/types';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import { EmptyStateComponent, PageModule } from '@kirbydesign/designsystem';

import { InvoiceModalService } from '../invoice';

type ViewModel = {
	state: Signal<WorkflowState>;
	invoices: Signal<InvoiceBookingWorkflowItem[]>;
	view: (invoice: InvoiceBookingWorkflowItem) => Promise<void>;
};

@Component({
	templateUrl: './invoice-booking.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, InvoiceListComponent, EmptyStateComponent],
})
export class InvoiceBookingModalComponent {
	readonly #InvoiceBookingService = inject(InvoiceBookingService);
	readonly #invoiceModalService = inject(InvoiceModalService);

	readonly vm: ViewModel = {
		state: this.#InvoiceBookingService.state,
		invoices: this.#InvoiceBookingService.invoices,
		view: this.#invoiceModalService.open.bind(this.#invoiceModalService),
	};
}
