import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { BillingDocumentsModalService } from '@atlas/modals/billing-documents';
import { BillingDocumentService } from '@atlas/services/billing-document';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-billing-documents-workflow-step',
	templateUrl: './billing-documents-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class BillingDocumentsWorkflowStepComponent {
	readonly #service = inject(BillingDocumentService);
	readonly #modalService = inject(BillingDocumentsModalService);

	readonly vm: ViewModel = {
		title: 'Create Billing Documents',
		icon: 'document',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
