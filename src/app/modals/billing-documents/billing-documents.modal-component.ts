import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { BillingDocumentListComponent } from '@atlas/components/billing-document-list';
import { BillingDocumentModalService } from '@atlas/modals/billing-document';
import { BillingDocumentService } from '@atlas/services/billing-document';
import type { WorkflowState } from '@atlas/types';
import type { BillingDocumentWorkflowItem } from '@atlas/workflow-items/billing-document';
import { EmptyStateComponent, PageModule } from '@kirbydesign/designsystem';

type ViewModel = {
	state: Signal<WorkflowState>;
	billingDocuments: Signal<BillingDocumentWorkflowItem[]>;
	view: (billingDocument: BillingDocumentWorkflowItem) => Promise<void>;
};

@Component({
	templateUrl: './billing-documents.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, EmptyStateComponent, BillingDocumentListComponent],
})
export class BillingDocumentsModalComponent {
	readonly #billingDocumentService = inject(BillingDocumentService);
	readonly #billingDocumentModalService = inject(BillingDocumentModalService);

	readonly vm: ViewModel = {
		state: this.#billingDocumentService.state,
		billingDocuments: this.#billingDocumentService.billingDocuments,
		view: this.#billingDocumentModalService.open.bind(this.#billingDocumentModalService),
	};
}
