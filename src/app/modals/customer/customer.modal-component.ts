import { ChangeDetectionStrategy, Component, computed, inject, type Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { disabled, type FieldTree, FormField, form, readonly, required } from "@angular/forms/signals";
import { DISMISS_ALERT_CONFIG } from "@atlas/constants";
import type { Settings } from "@atlas/models";
import { CustomerService } from "@atlas/services/customer";
import type { Customer, CustomerResource } from "@atlas/types";
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
} from "@kirbydesign/designsystem";

export type ComponentProps = {
	customer: CustomerResource;
	settings: Settings;
};

type ViewModel = {
	form: FieldTree<Required<Customer>>;
	errorMessage: Signal<string | null>;
	isLoading: Signal<boolean>;
	unsubmittable: Signal<boolean>;
	submitMessage: Signal<string>;
	submit: () => Promise<void>;
};

@Component({
	templateUrl: "./customer.modal-component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		CardModule,
		FormFieldModule,
		InputComponent,
		FormField,
		ModalFooterComponent,
		FormsModule,
		ButtonComponent,
		LoadingOverlayComponent,
		FlagComponent,
	],
})
export class CustomerModalComponent {
	readonly #modal = inject(Modal);
	readonly #props = inject<ComponentProps>(COMPONENT_PROPS);
	readonly #customerService = inject(CustomerService);

	readonly #errorMessage = signal(this.#props.customer.status === "error" ? this.#props.customer.message : null);

	readonly #isLoading = signal(false);
	readonly #model = signal<Required<Customer>>({
		...this.#props.customer.model,
		id: this.#props.customer.model.id ?? NaN,
		group: this.#props.customer.model.group ?? this.#props.settings.defaults.customerGroup ?? NaN,
		paymentTerms: this.#props.customer.model.paymentTerms ?? this.#props.settings.defaults.paymentTerms ?? NaN,
		vatZone: this.#props.customer.model.vatZone ?? this.#props.settings.defaults.vatZone ?? NaN,
	});
	readonly #form = form(this.#model, (schema) => {
		readonly(schema.ean);
		required(schema.name, { message: "Customer name is required" });
		disabled(schema.name, ({ valueOf }) => !Number.isNaN(valueOf(schema.id)));
		required(schema.group, { message: "Customer group is required" });
		disabled(schema.group, ({ valueOf }) => !Number.isNaN(valueOf(schema.id)));
		required(schema.paymentTerms, { message: "Payment terms is required" });
		disabled(schema.paymentTerms, ({ valueOf }) => !Number.isNaN(valueOf(schema.id)));
		required(schema.vatZone, { message: "VAT zone is required" });
		disabled(schema.vatZone, ({ valueOf }) => !Number.isNaN(valueOf(schema.id)));
	});
	readonly #unsubmittable = computed(() => this.#form().invalid() || this.#isLoading());
	readonly #submitMessage = computed(() => (Number.isNaN(this.#form.id().value()) ? "Create" : "Update"));

	constructor() {
		this.#modal.canDismiss = computed(() => (this.#form().dirty() ? DISMISS_ALERT_CONFIG : true));
	}

	async #submit(): Promise<void> {
		this.#isLoading.set(true);
		this.#submitCustomer()
			.then(this.#closeModal.bind(this))
			.catch((error) => this.#errorMessage.set(error.message))
			.finally(() => this.#isLoading.set(false));
	}

	async #submitCustomer(): Promise<void> {
		const formValue = this.#form().value();
		if (Number.isNaN(formValue.id)) {
			await this.#customerService.createCustomer(formValue, this.#props.settings);
		} else {
			await this.#customerService.updateCustomer(formValue.ean, formValue.id);
		}
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		form: this.#form,
		isLoading: this.#isLoading.asReadonly(),
		errorMessage: this.#errorMessage,
		unsubmittable: this.#unsubmittable,
		submitMessage: this.#submitMessage,
		submit: this.#submit.bind(this),
	};
}
