import { ChangeDetectionStrategy, Component, computed, inject, type Signal, signal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { CustomerFormComponent } from '@atlas/components/customer-form';
import { DISMISS_ALERT_CONFIG } from '@atlas/constants';
import { customerForm } from '@atlas/forms/customer';
import type { Settings } from '@atlas/models';
import type { Customer, Defined } from '@atlas/types';
import type { CustomerPipelineItem } from '@atlas/utils/customer-pipeline-item';
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
	customer: CustomerPipelineItem;
	settings: Settings;
};

type ViewModel = {
	errorMessage: Signal<string | undefined>;
	isLoading: Signal<boolean>;
	form: FieldTree<Defined<Customer>>;
	unsubmittable: Signal<boolean>;
	submit: () => Promise<void>;
};

@Component({
	templateUrl: './customer.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		LoadingOverlayComponent,
		CustomerFormComponent,
		ModalFooterComponent,
		ButtonComponent,
		FlagComponent,
	],
})
export class CustomerModalComponent {
	readonly #props = inject<ComponentProps>(COMPONENT_PROPS);
	readonly #modal = inject(Modal);

	readonly #saving = signal(false);
	readonly #errorMessage = signal(this.#props.customer.error()?.message);
	readonly #form = customerForm(
		this.#props.customer.output() ?? this.#props.customer.input(),
		this.#props.settings.defaults,
	);

	readonly #unsubmittable = computed(() => this.#form().invalid() || this.#saving());

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
		if (this.#form().invalid()) {
			this.#errorMessage.set('form is invalid');
		} else {
			this.#props.customer.input = this.#form().value();
			await this.#closeModal();
		}
		this.#saving.set(false);
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		errorMessage: this.#errorMessage.asReadonly(),
		isLoading: this.#saving.asReadonly(),
		form: this.#form,
		unsubmittable: this.#unsubmittable,
		submit: this.#submit.bind(this),
	};
}
