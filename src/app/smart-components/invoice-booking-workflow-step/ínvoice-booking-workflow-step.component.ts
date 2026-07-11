import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { InvoiceBookingModalService } from '@atlas/modals/invoice-booking';
import { InvoiceBookingService } from '@atlas/services/invoice-booking';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-invoice-booking-workflow-step',
	templateUrl: './invoice-booking-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class InvoiceBookingWorkflowStepComponent {
	readonly #service = inject(InvoiceBookingService);
	readonly #modalService = inject(InvoiceBookingModalService);

	readonly vm: ViewModel = {
		title: 'Book Invoices',
		icon: 'document',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
