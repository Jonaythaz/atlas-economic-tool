import { ChangeDetectionStrategy, Component, computed, inject, resource, type Signal, signal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { SettingsFormComponent } from '@atlas/components/settings-form';
import { DISMISS_ALERT_CONFIG } from '@atlas/constants';
import { settingsForm } from '@atlas/forms/settings';
import type { Settings } from '@atlas/models';
import { SettingsService } from '@atlas/services/settings';
import type { Defined } from '@atlas/types';
import {
	ButtonComponent,
	FlagComponent,
	LoadingOverlayComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
	ToastController,
} from '@kirbydesign/designsystem';

type ViewModel = {
	isLoading: Signal<boolean>;
	errorMessage: Signal<string | undefined>;
	form: FieldTree<Defined<Settings>>;
	unsubmittable: Signal<boolean>;
	submit: () => Promise<void>;
};

@Component({
	selector: 'atlas-settings-modal',
	templateUrl: './settings.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		LoadingOverlayComponent,
		FlagComponent,
		ButtonComponent,
		SettingsFormComponent,
		ModalFooterComponent,
	],
})
export class SettingsModalComponent {
	readonly #modal = inject(Modal);

	readonly #toastController = inject(ToastController);
	readonly #settingsService = inject(SettingsService);

	readonly #saving = signal(false);

	readonly #settings = resource({ loader: () => this.#settingsService.loadSettings() });

	readonly #form = settingsForm(() => (this.#settings.hasValue() ? this.#settings.value() : null));

	readonly #isLoading = computed(() => this.#settings.isLoading() || this.#saving());
	readonly #errorMessage = computed(() => this.#settings.error()?.message);
	readonly #unsubmittable = computed(() => !this.#form().dirty() || this.#form().invalid() || this.#saving());

	constructor() {
		this.#modal.canDismiss = computed(() => {
			if (this.#saving()) {
				return false;
			}
			return this.#form().dirty() ? DISMISS_ALERT_CONFIG : true;
		});
	}

	async #save(): Promise<void> {
		this.#saving.set(true);
		await this.#settingsService
			.saveSettings(this.#formValue())
			.then(this.#closeModal.bind(this))
			.catch((error) =>
				this.#toastController.showToast({
					message: `Was unable to persist changes to settings: ${error.message}`,
					messageType: 'warning',
				}),
			)
			.finally(() => this.#saving.set(false));
	}

	#formValue(): Settings {
		const { tokens, defaults } = this.#form().value();
		return {
			tokens: tokens,
			defaults: {
				customerGroup: Number.isNaN(defaults.customerGroup) ? null : defaults.customerGroup,
				productGroup: Number.isNaN(defaults.productGroup) ? null : defaults.productGroup,
				paymentTerms: Number.isNaN(defaults.paymentTerms) ? null : defaults.paymentTerms,
				vatZone: Number.isNaN(defaults.vatZone) ? null : defaults.vatZone,
				layout: Number.isNaN(defaults.layout) ? null : defaults.layout,
			},
		};
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		isLoading: this.#isLoading,
		errorMessage: this.#errorMessage,
		form: this.#form,
		unsubmittable: this.#unsubmittable,
		submit: this.#save.bind(this),
	};
}
