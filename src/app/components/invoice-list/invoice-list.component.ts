import { ChangeDetectionStrategy, Component, input, output, type Signal } from '@angular/core';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import { ItemComponent, LabelComponent, ListComponent, ListItemTemplateDirective } from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

type ViewModel = {
	invoices: Signal<InvoiceBookingWorkflowItem[]>;
	selectInvoice: (document: InvoiceBookingWorkflowItem) => void;
};

@Component({
	selector: 'atlas-invoice-list',
	templateUrl: './invoice-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListComponent, ItemComponent, LabelComponent, WorkflowStateIndicatorComponent, ListItemTemplateDirective],
})
export class InvoiceListComponent {
	readonly invoices = input.required<InvoiceBookingWorkflowItem[]>();
	readonly selected = output<InvoiceBookingWorkflowItem>();

	readonly vm: ViewModel = {
		invoices: this.invoices,
		selectInvoice: this.selected.emit.bind(this.selected),
	};
}
