import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { ProductsModalService } from '@atlas/modals/products';
import { ProductService } from '@atlas/services/product';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-products-workflow-step',
	templateUrl: './products-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class ProductsWorkflowStepComponent {
	readonly #service = inject(ProductService);
	readonly #modalService = inject(ProductsModalService);

	readonly vm: ViewModel = {
		title: 'Create Products',
		icon: 'collection',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
