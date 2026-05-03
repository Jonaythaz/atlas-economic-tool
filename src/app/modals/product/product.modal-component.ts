import { ChangeDetectionStrategy, Component, computed, inject, type Signal, signal } from '@angular/core';
import { type FieldTree, form, readonly, required } from '@angular/forms/signals';
import { ProductFormComponent } from '@atlas/components/product-form';
import { DISMISS_ALERT_CONFIG } from '@atlas/constants';
import type { Settings } from '@atlas/models';
import type { Product } from '@atlas/types';
import type { ProductPipelineItem } from '@atlas/utils/product-pipeline-item';
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
	product: ProductPipelineItem;
	settings: Settings;
};

type ViewModel = {
	form: FieldTree<Required<Product>>;
	errorMessage: Signal<string | undefined>;
	isLoading: Signal<boolean>;
	unsubmittable: Signal<boolean>;
	submit: () => Promise<void>;
};

@Component({
	templateUrl: './product.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		ProductFormComponent,
		ModalFooterComponent,
		ButtonComponent,
		LoadingOverlayComponent,
		FlagComponent,
	],
})
export class ProductModalComponent {
	readonly #modal = inject(Modal);
	readonly #props = inject<ComponentProps>(COMPONENT_PROPS);

	readonly #errorMessage = signal(this.#props.product.error()?.message);

	readonly #isLoading = signal(false);
	readonly #model = signal<Required<Product>>({
		...this.#props.product.input(),
		group: this.#props.product.input().group ?? this.#props.settings.defaults.productGroup ?? NaN,
	});
	readonly #form = form(this.#model, (schema) => {
		readonly(schema.id);
		required(schema.name, { message: 'Product name is required' });
		required(schema.group, { message: 'Product group is required' });
	});
	readonly #unsubmittable = computed(() => this.#form().invalid() || this.#isLoading());

	constructor() {
		this.#modal.canDismiss = computed(() => (this.#form().dirty() ? DISMISS_ALERT_CONFIG : true));
	}

	async #submit(): Promise<void> {
		this.#isLoading.set(true);
		if (this.#form().invalid()) {
			this.#errorMessage.set('form is invalid');
		} else {
			this.#props.product.input = this.#form().value();
			await this.#closeModal();
		}
		this.#isLoading.set(false);
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		form: this.#form,
		errorMessage: this.#errorMessage,
		isLoading: this.#isLoading.asReadonly(),
		unsubmittable: this.#unsubmittable,
		submit: this.#submit.bind(this),
	};
}
