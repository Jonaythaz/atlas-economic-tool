import { ChangeDetectionStrategy, Component, computed, inject, type Signal, signal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { ProductFormComponent } from '@atlas/components/product-form';
import { DISMISS_ALERT_CONFIG } from '@atlas/constants';
import { productForm } from '@atlas/forms/product';
import type { Settings } from '@atlas/models';
import type { Defined, Product } from '@atlas/types';
import type { ProductWorkflowItem } from '@atlas/workflow-items/product';
import {
	ButtonComponent,
	COMPONENT_PROPS,
	FlagComponent,
	LoadingOverlayComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
} from '@kirbydesign/designsystem';

export type ComponentProps = {
	product: ProductWorkflowItem;
	settings: Settings;
};

type ViewModel = {
	errorMessage: Signal<string | undefined>;
	isLoading: Signal<boolean>;
	form: FieldTree<Defined<Product>>;
	unsubmittable: Signal<boolean>;
	submit: () => Promise<void>;
};

@Component({
	templateUrl: './product.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		LoadingOverlayComponent,
		ProductFormComponent,
		ModalFooterComponent,
		ButtonComponent,
		FlagComponent,
	],
})
export class ProductModalComponent {
	readonly #props = inject<ComponentProps>(COMPONENT_PROPS);
	readonly #modal = inject(Modal);

	readonly #saving = signal(false);
	readonly #form = productForm(this.#props.product.value(), this.#props.settings.defaults);

	readonly #unsubmittable = computed(() => !this.#form().dirty() || this.#form().invalid() || this.#saving());

	constructor() {
		this.#modal.canDismiss = computed(() => {
			if (this.#saving()) {
				return false;
			}
			return this.#form().dirty() ? DISMISS_ALERT_CONFIG : true;
		});
	}

	async #submit(): Promise<void> {
		this.#saving.set(true);
		this.#props.product.value = this.#form().value();
		await this.#closeModal();
		this.#saving.set(false);
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		errorMessage: this.#props.product.errorMessage,
		isLoading: this.#saving.asReadonly(),
		form: this.#form,
		unsubmittable: this.#unsubmittable,
		submit: this.#submit.bind(this),
	};
}
