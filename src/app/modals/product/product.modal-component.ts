import { ChangeDetectionStrategy, Component, computed, inject, type Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { disabled, Field, type FieldTree, form, readonly, required } from "@angular/forms/signals";
import {
	ButtonComponent,
	CardModule,
	COMPONENT_PROPS,
	FlagComponent,
	FormFieldModule,
	InputComponent,
	LoadingOverlayComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
	ToastController,
} from "@kirbydesign/designsystem";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import type { Settings } from "../../models";
import { ProductService } from "../../services/product";
import type { Product, ProductResource } from "../../types";

export type ComponentProps = {
	product: ProductResource;
	settings: Settings;
};

type ViewModel = {
	form: FieldTree<Required<Product>>;
	errorMessage: string | null;
	isLoading: Signal<boolean>;
	unsubmittable: Signal<boolean>;
	submit: () => Promise<void>;
};

@Component({
	templateUrl: "./product.modal-component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		CardModule,
		FormFieldModule,
		InputComponent,
		Field,
		FormsModule,
		ModalFooterComponent,
		ButtonComponent,
		LoadingOverlayComponent,
		FlagComponent,
	],
})
export class ProductModalComponent {
	readonly #modal = inject(Modal);
	readonly #props = inject<ComponentProps>(COMPONENT_PROPS);
	readonly #productService = inject(ProductService);
	readonly #toastController = inject(ToastController);

	readonly #uneditable = this.#props.product.status === "created";
	readonly #errorMessage = this.#props.product.status === "error" ? this.#props.product.message : null;

	readonly #isLoading = signal(false);
	readonly #model = signal<Required<Product>>({
		...this.#props.product.model,
		group: this.#props.product.model.group ?? this.#props.settings.defaults.productGroup ?? NaN,
	});
	readonly #form = form(this.#model, (schema) => {
		readonly(schema.id);
		required(schema.name, { message: "Product name is required" });
		disabled(schema.name, () => this.#uneditable);
		required(schema.group, { message: "Product group is required" });
		disabled(schema.group, () => this.#uneditable);
	});
	readonly #unsubmittable = computed(() => this.#form().invalid() || this.#isLoading());

	constructor() {
		this.#modal.canDismiss = computed(() => (this.#form().dirty() ? DISMISS_ALERT_CONFIG : true));
	}

	async #submit(): Promise<void> {
		this.#isLoading.set(true);
		await this.#productService
			.createProduct(this.#form().value(), this.#props.settings)
			.then(this.#closeModal.bind(this))
			.catch((error) =>
				this.#toastController.showToast({
					message: error instanceof Error ? error.message : "Unexpected error occured",
					messageType: "warning",
				}),
			)
			.finally(() => this.#isLoading.set(false));
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
