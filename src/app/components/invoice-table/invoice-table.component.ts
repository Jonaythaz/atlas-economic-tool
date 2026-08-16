import { ChangeDetectionStrategy, Component, computed, model, output, type Signal } from '@angular/core';
import { INVOICE_ACTION_SEGMENTS } from '@atlas/constants';
import type { InvoiceActionSegmentItem } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import {
	ButtonComponent,
	CheckboxComponent,
	IconComponent,
	SegmentedControlComponent,
} from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

type ViewModel = {
	invoices: Signal<InvoiceWorkflowItem[]>;
	allChecked: Signal<boolean>;
	indeterminate: Signal<boolean>;
	invoiceActionSegmentItems: InvoiceActionSegmentItem[];
	invoiceActionSegments: typeof INVOICE_ACTION_SEGMENTS;
	toggleAll: () => void;
	selectInvoice: (invoice: InvoiceWorkflowItem) => void;
};

@Component({
	selector: 'atlas-invoice-table',
	templateUrl: './invoice-table.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CheckboxComponent,
		WorkflowStateIndicatorComponent,
		ButtonComponent,
		IconComponent,
		SegmentedControlComponent,
	],
})
export class InvoiceTableComponent {
	readonly invoices = model.required<InvoiceWorkflowItem[]>();
	readonly invoiceSelected = output<InvoiceWorkflowItem>();

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
		invoiceActionSegmentItems: Object.values(INVOICE_ACTION_SEGMENTS),
		invoiceActionSegments: INVOICE_ACTION_SEGMENTS,
		toggleAll: this.#toggleAll.bind(this),
		selectInvoice: this.invoiceSelected.emit.bind(this.invoiceSelected),
	};
}

enum SelectionState {
	ALL_SELECTED,
	NONE_SELECTED,
	INDETERMINATE,
}
