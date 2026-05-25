import { ChangeDetectionStrategy, Component, input, output, type Signal } from '@angular/core';
import type { BillingDocumentWorkflowItem } from '@atlas/workflow-items/billing-document';
import {
	ItemComponent,
	LabelComponent,
	ListComponent,
	ListItemTemplateDirective,
	ListSectionHeaderComponent,
	ListSectionHeaderDirective,
} from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

type ViewModel = {
	documents: Signal<BillingDocumentWorkflowItem[]>;
	getSectionName: (document: BillingDocumentWorkflowItem) => string;
	selectDocument: (document: BillingDocumentWorkflowItem) => void;
};

@Component({
	selector: 'atlas-billing-document-list',
	templateUrl: './billing-document-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ListComponent,
		ListSectionHeaderComponent,
		ItemComponent,
		LabelComponent,
		WorkflowStateIndicatorComponent,
		ListSectionHeaderDirective,
		ListItemTemplateDirective,
	],
})
export class BillingDocumentListComponent {
	readonly documents = input.required<BillingDocumentWorkflowItem[]>();
	readonly selected = output<BillingDocumentWorkflowItem>();

	readonly vm: ViewModel = {
		documents: this.documents,
		getSectionName: (document) => (document.value().type === 'invoice' ? 'Invoices' : 'Credit Notes'),
		selectDocument: this.selected.emit.bind(this.selected),
	};
}
