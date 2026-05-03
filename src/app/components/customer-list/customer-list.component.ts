import { ChangeDetectionStrategy, Component, inject, type Resource } from '@angular/core';
import { StatusIndicatorComponent } from '@atlas/components/status-indicator';
import { CustomerModalService } from '@atlas/modals/customer';
import { DocumentService } from '@atlas/services/document';
import type { CustomerPipelineItem } from '@atlas/utils/customer-pipeline-item';
import {
	ItemComponent,
	ListComponent,
	ListItemTemplateDirective,
	ListSectionHeaderComponent,
	ListSectionHeaderDirective,
} from '@kirbydesign/designsystem';

type ViewModel = {
	customers: Resource<CustomerPipelineItem[] | undefined>;
	getSectionName: (customer: CustomerPipelineItem) => string;
	selectCustomer: (customer: CustomerPipelineItem) => Promise<void>;
};

@Component({
	selector: 'atlas-customer-list',
	templateUrl: './customer-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ListComponent,
		ListSectionHeaderComponent,
		ItemComponent,
		StatusIndicatorComponent,
		ListSectionHeaderDirective,
		ListItemTemplateDirective,
	],
})
export class CustomerListComponent {
	readonly #pipelineStep = inject(DocumentService).customerPipelineStep;
	readonly #modalService = inject(CustomerModalService);

	readonly vm: ViewModel = {
		customers: this.#pipelineStep.items,
		getSectionName: (item: CustomerPipelineItem) =>
			item.input().type === 'private' ? 'Private Customers' : 'Business Customers',
		selectCustomer: this.#modalService.open.bind(this.#modalService),
	};
}
