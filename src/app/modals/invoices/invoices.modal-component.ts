import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { InvoiceTableComponent } from '@atlas/components/invoice-table';
import { InvoiceModalService } from '@atlas/modals/invoice';
import { InvoiceService } from '@atlas/services/invoice';
import type { WorkflowState } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import { ButtonComponent, EmptyStateComponent, ModalFooterComponent, PageModule } from '@kirbydesign/designsystem';

type ViewModel = {
	state: Signal<WorkflowState>;
	invoices: Signal<InvoiceWorkflowItem[]>;
	view: (invoice: InvoiceWorkflowItem) => Promise<void>;
	create: () => Promise<void>;
};

@Component({
	templateUrl: './invoices.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, EmptyStateComponent, InvoiceTableComponent, ModalFooterComponent, ButtonComponent],
})
export class InvoicesModalComponent {
	readonly #invoiceService = inject(InvoiceService);
	readonly #invoiceModalService = inject(InvoiceModalService);

	readonly vm: ViewModel = {
		state: this.#invoiceService.state,
		invoices: this.#invoiceService.invoices,
		view: this.#invoiceModalService.open.bind(this.#invoiceModalService),
		create: this.#invoiceService.createInvoices.bind(this.#invoiceService),
	};
}
