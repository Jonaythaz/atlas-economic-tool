import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { CustomerListComponent } from '@atlas/components/customer-list';
import { CustomerService } from '@atlas/services/customer';
import type { WorkflowState } from '@atlas/types';
import type { CustomerWorkflowItem } from '@atlas/workflow-items/customer';
import { ButtonComponent, EmptyStateComponent, ModalFooterComponent, PageModule } from '@kirbydesign/designsystem';

import { CustomerModalService } from '../customer/customer.modal-service';

type ViewModel = {
	state: Signal<WorkflowState>;
	customers: Signal<CustomerWorkflowItem[]>;
	unrunnable: Signal<boolean>;
	view: (customer: CustomerWorkflowItem) => Promise<void>;
	run: () => Promise<void>;
};

@Component({
	templateUrl: './customers.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, EmptyStateComponent, CustomerListComponent, ModalFooterComponent, ButtonComponent],
})
export class CustomersModalComponent {
	readonly #customerService = inject(CustomerService);
	readonly #customerModalService = inject(CustomerModalService);

	readonly #unrunnable = computed(() => UNRUNNABLE_STATES.has(this.#customerService.state()));

	readonly vm: ViewModel = {
		state: this.#customerService.state,
		customers: this.#customerService.customers,
		unrunnable: this.#unrunnable,
		view: this.#customerModalService.open.bind(this.#customerModalService),
		run: this.#customerService.run.bind(this.#customerService),
	};
}

const UNRUNNABLE_STATES = new Set<WorkflowState>(['idle', 'running', 'completed']);
