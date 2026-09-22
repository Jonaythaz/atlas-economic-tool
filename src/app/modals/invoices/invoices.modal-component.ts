import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { InvoiceTableComponent } from '@atlas/components/invoice-table';
import { InvoicePageService } from '@atlas/pages/invoice/invoice.page-service';
import { InvoiceService } from '@atlas/services/invoice';
import type { WorkflowState } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import {
	ButtonComponent,
	EmptyStateComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
} from '@kirbydesign/designsystem';

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
	readonly #modal = inject(Modal);
	readonly #invoiceService = inject(InvoiceService);
	readonly #invoicePageService = inject(InvoicePageService);

	async #showInvoice(invoice: InvoiceWorkflowItem): Promise<void> {
		await this.#invoicePageService.navigate(invoice.value().id).then(async (success) => {
			if (success) {
				await this.#modal.close();
			}
		});
	}

	readonly vm: ViewModel = {
		state: this.#invoiceService.state,
		invoices: this.#invoiceService.invoices,
		view: this.#showInvoice.bind(this),
		create: this.#invoiceService.createInvoices.bind(this.#invoiceService),
	};
}
