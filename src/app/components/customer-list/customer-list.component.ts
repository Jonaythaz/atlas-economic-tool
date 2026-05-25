import { ChangeDetectionStrategy, Component, input, output, type Signal } from '@angular/core';
import type { CustomerWorkflowItem } from '@atlas/workflow-items/customer';
import { ItemComponent } from '@kirbydesign/designsystem/item';
import {
	ListComponent,
	ListItemTemplateDirective,
	ListSectionHeaderComponent,
	ListSectionHeaderDirective,
} from '@kirbydesign/designsystem/list';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator/workflow-state-indicator.component';

type ViewModel = {
	customers: Signal<CustomerWorkflowItem[]>;
	getSectionName: (customer: CustomerWorkflowItem) => string;
	selectCustomer: (customer: CustomerWorkflowItem) => void;
};

@Component({
	selector: 'atlas-customer-list',
	templateUrl: './customer-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ListComponent,
		ListSectionHeaderComponent,
		ItemComponent,
		WorkflowStateIndicatorComponent,
		ListSectionHeaderDirective,
		ListItemTemplateDirective,
	],
})
export class CustomerListComponent {
	readonly customers = input.required<CustomerWorkflowItem[]>();
	readonly selected = output<CustomerWorkflowItem>();

	readonly vm: ViewModel = {
		customers: this.customers,
		getSectionName: (customer) => (customer.value().type === 'private' ? 'Private Customers' : 'Business Customers'),
		selectCustomer: this.selected.emit.bind(this.selected),
	};
}
