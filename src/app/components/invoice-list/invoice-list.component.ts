import { ChangeDetectionStrategy, Component, input, type Signal } from '@angular/core';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import {
	CheckboxComponent,
	ItemComponent,
	LabelComponent,
	ListComponent,
	ListItemTemplateDirective,
} from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

type ViewModel = {
	invoices: Signal<InvoiceBookingWorkflowItem[]>;
};

@Component({
	selector: 'atlas-invoice-list',
	templateUrl: './invoice-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ListComponent,
		ItemComponent,
		LabelComponent,
		WorkflowStateIndicatorComponent,
		ListItemTemplateDirective,
		CheckboxComponent,
	],
})
export class InvoiceListComponent {
	readonly invoices = input.required<InvoiceBookingWorkflowItem[]>();

	readonly vm: ViewModel = {
		invoices: this.invoices,
	};
}
