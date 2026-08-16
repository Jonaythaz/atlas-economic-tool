import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { InvoicesModalService } from '@atlas/modals/invoices';
import { InvoiceService } from '@atlas/services/invoice';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-invoices-workflow-step',
	templateUrl: './invoices-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class InvoicesWorkflowStepComponent {
	readonly #service = inject(InvoiceService);
	readonly #modalService = inject(InvoicesModalService);

	readonly vm: ViewModel = {
		title: 'Create Invoices',
		icon: 'document',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
