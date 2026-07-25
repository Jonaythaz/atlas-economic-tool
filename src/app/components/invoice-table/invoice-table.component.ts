import { ChangeDetectionStrategy, Component, computed, model, output, type Signal } from '@angular/core';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import { ButtonComponent, CheckboxComponent, IconComponent } from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

type ViewModel = {
	invoices: Signal<InvoiceBookingWorkflowItem[]>;
	allChecked: Signal<boolean>;
	indeterminate: Signal<boolean>;
	toggleAll: () => void;
	selectInvoice: (invoice: InvoiceBookingWorkflowItem) => void;
};

@Component({
	selector: 'atlas-invoice-table',
	templateUrl: './invoice-table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CheckboxComponent, WorkflowStateIndicatorComponent, ButtonComponent, IconComponent],
})
export class InvoiceTableComponent {
	readonly invoices = model.required<InvoiceBookingWorkflowItem[]>();
	readonly invoiceSelected = output<InvoiceBookingWorkflowItem>();

	readonly #selectionState = computed(() => {
		const invoices = this.invoices();
		const selectedCount = invoices.filter((invoice) => invoice.selected()).length;
		if (selectedCount === 0) return SelectionState.NONE_SELECTED;
		return selectedCount === invoices.length ? SelectionState.ALL_SELECTED : SelectionState.INDETERMINATE;
	});

	readonly #allChecked = computed(() => this.#selectionState() === SelectionState.ALL_SELECTED);

	#toggleAll(): void {
		const newState = !this.#allChecked();
		this.invoices().forEach((invoice) => {
			invoice.selected.set(newState);
		});
	}

	readonly vm: ViewModel = {
		invoices: this.invoices,
		allChecked: this.#allChecked,
		indeterminate: computed(() => this.#selectionState() === SelectionState.INDETERMINATE),
		toggleAll: this.#toggleAll.bind(this),
		selectInvoice: this.invoiceSelected.emit.bind(this.invoiceSelected),
	};
}

enum SelectionState {
	ALL_SELECTED,
	NONE_SELECTED,
	INDETERMINATE,
}
