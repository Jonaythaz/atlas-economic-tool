import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { CustomersModalService } from '@atlas/modals/customers';
import { CustomerService } from '@atlas/services/customer';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-customers-workflow-step',
	templateUrl: './customers-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class CustomersWorkflowStepComponent {
	readonly #service = inject(CustomerService);
	readonly #modalService = inject(CustomersModalService);

	readonly vm: ViewModel = {
		title: 'Create Customers',
		icon: 'common',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
