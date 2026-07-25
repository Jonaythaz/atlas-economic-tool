import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { WorkflowStateIndicatorComponent } from '@atlas/components/workflow-state-indicator';
import { InvoiceBookingService } from '@atlas/services/invoice-booking';
import type { WorkflowState } from '@atlas/types';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import {
	ButtonComponent,
	CheckboxComponent,
	EmptyStateComponent,
	IconComponent,
	ModalFooterComponent,
	PageModule,
} from '@kirbydesign/designsystem';

import { InvoiceModalService } from '../invoice';

type ViewModel = {
	allChecked: Signal<boolean>;
	indeterminate: Signal<boolean>;
	state: Signal<WorkflowState>;
	invoices: Signal<InvoiceBookingWorkflowItem[]>;
	noneChecked: Signal<boolean>;
	toggleAll: () => void;
	viewInvoice: (invoice: InvoiceBookingWorkflowItem) => Promise<void>;
	book: () => Promise<void>;
};

@Component({
	templateUrl: './invoice-booking.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		EmptyStateComponent,
		CheckboxComponent,
		ModalFooterComponent,
		ButtonComponent,
		WorkflowStateIndicatorComponent,
		IconComponent,
	],
})
export class InvoiceBookingModalComponent {
	readonly #invoiceBookingService = inject(InvoiceBookingService);
	readonly #invoiceModalService = inject(InvoiceModalService);

	readonly #selectionState = computed(() => {
		const invoices = this.#invoiceBookingService.invoices().filter((invoice) => invoice.state() !== 'completed');
		const selectedCount = invoices.filter((invoice) => invoice.selected()).length;
		if (selectedCount === 0) return SelectionState.NONE_SELECTED;
		return selectedCount === invoices.length ? SelectionState.ALL_SELECTED : SelectionState.INDETERMINATE;
	});

	readonly #allChecked = computed(() => this.#selectionState() === SelectionState.ALL_SELECTED);

	#toggleAll(): void {
		const newState = !this.#allChecked();
		this.#invoiceBookingService.invoices().forEach((invoice) => {
			if (invoice.state() !== 'completed') {
				invoice.selected.set(newState);
			}
		});
	}

	readonly vm: ViewModel = {
		allChecked: this.#allChecked,
		indeterminate: computed(() => this.#selectionState() === SelectionState.INDETERMINATE),
		state: this.#invoiceBookingService.state,
		invoices: this.#invoiceBookingService.invoices,
		noneChecked: computed(() => this.#selectionState() === SelectionState.NONE_SELECTED),
		toggleAll: this.#toggleAll.bind(this),
		viewInvoice: this.#invoiceModalService.open.bind(this.#invoiceModalService),
		book: this.#invoiceBookingService.bookInvoices.bind(this.#invoiceBookingService),
	};
}

enum SelectionState {
	ALL_SELECTED,
	NONE_SELECTED,
	INDETERMINATE,
}
