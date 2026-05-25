import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from '@angular/core';
import { ProductListComponent } from '@atlas/components/product-list';
import { ProductService } from '@atlas/services/product';
import type { WorkflowState } from '@atlas/types';
import type { ProductWorkflowItem } from '@atlas/workflow-items/product';
import { ButtonComponent, EmptyStateComponent, ModalFooterComponent, PageModule } from '@kirbydesign/designsystem';

import { ProductModalService } from '../product/product.modal-service';

type ViewModel = {
	state: Signal<WorkflowState>;
	products: Signal<ProductWorkflowItem[]>;
	unrunnable: Signal<boolean>;
	view: (product: ProductWorkflowItem) => Promise<void>;
	run: () => Promise<void>;
};

@Component({
	templateUrl: './products.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, EmptyStateComponent, ProductListComponent, ModalFooterComponent, ButtonComponent],
})
export class ProductsModalComponent {
	readonly #productService = inject(ProductService);
	readonly #productModalService = inject(ProductModalService);

	readonly #unrunnable = computed(() => UNRUNNABLE_STATES.has(this.#productService.state()));

	readonly vm: ViewModel = {
		state: this.#productService.state,
		products: this.#productService.products,
		unrunnable: this.#unrunnable,
		view: this.#productModalService.open.bind(this.#productModalService),
		run: this.#productService.run.bind(this.#productService),
	};
}

const UNRUNNABLE_STATES = new Set<WorkflowState>(['idle', 'running', 'completed']);
