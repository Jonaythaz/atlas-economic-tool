import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, type Signal, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Field, type FieldTree, form, required } from "@angular/forms/signals";
import {
	ButtonComponent,
	CardModule,
	EmptyStateModule,
	FormFieldModule,
	InputComponent,
	LoadingOverlayComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
	SectionHeaderComponent,
	ToastController,
} from "@kirbydesign/designsystem";
import { updateSettings } from "../../commands";
import { DEFAULT_SETTINGS, DISMISS_ALERT_CONFIG } from "../../constants";
import type { Defaults, Settings, Tokens } from "../../models";
import { SettingsService } from "../../services/settings";

type ViewModel = {
	form: FieldTree<SettingsModel>;
	isLoading: Signal<boolean>;
	error: Signal<string | undefined>;
	unsubmittable: Signal<boolean>;
	reload: () => void;
	submit: () => Promise<void>;
};

@Component({
	selector: "atlas-settings-modal",
	templateUrl: "./settings.modal-component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		ButtonComponent,
		CardModule,
		FormFieldModule,
		InputComponent,
		Field,
		FormsModule,
		ModalFooterComponent,
		LoadingOverlayComponent,
		EmptyStateModule,
		SectionHeaderComponent,
	],
})
export class SettingsModalComponent {
	readonly #modal = inject(Modal);
	readonly #settingsService = inject(SettingsService);
	readonly #toastController = inject(ToastController);

	readonly #saving = signal(false);
	readonly #model = linkedSignal<SettingsModel>(() => {
		const { tokens, defaults } = this.#settingsService.settings() ?? DEFAULT_SETTINGS;
		return {
			tokens: tokens,
			defaults: {
				customerGroup: defaults.customerGroup ?? NaN,
				productGroup: defaults.productGroup ?? NaN,
				paymentTerms: defaults.paymentTerms ?? NaN,
				vatZone: defaults.vatZone ?? NaN,
				layout: defaults.layout ?? NaN,
			},
		};
	});
	readonly #form = form(this.#model, (schema) => {
		required(schema.tokens.secret, { message: "Secret token is required" });
		required(schema.tokens.grant, { message: "Grant token is required" });
	});

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
		await updateSettings(this.#formValue())
			.then(this.#closeModal.bind(this))
			.catch((error) =>
				this.#toastController.showToast({
					message: `Was unable to save settings: ${error.message}`,
					messageType: "warning",
				}),
			)
			.finally(() => this.#saving.set(false));
	}

	#formValue(): Settings {
		const { tokens, defaults } = this.#form().value();
		return {
			tokens: tokens,
			defaults: {
				customerGroup: Number.isNaN(defaults.customerGroup) ? undefined : defaults.customerGroup,
				productGroup: Number.isNaN(defaults.productGroup) ? undefined : defaults.productGroup,
				paymentTerms: Number.isNaN(defaults.paymentTerms) ? undefined : defaults.paymentTerms,
				vatZone: Number.isNaN(defaults.vatZone) ? undefined : defaults.vatZone,
				layout: Number.isNaN(defaults.layout) ? undefined : defaults.layout,
			},
		};
	}

	async #closeModal(): Promise<void> {
		this.#modal.canDismiss = () => true;
		await this.#modal.close();
	}

	readonly vm: ViewModel = {
		form: this.#form,
		isLoading: computed(() => this.#settingsService.isLoading() || this.#saving()),
		error: this.#settingsService.error,
		unsubmittable: this.#unsubmittable,
		reload: this.#settingsService.load.bind(this.#settingsService),
		submit: this.#save.bind(this),
	};
}

type SettingsModel = {
	tokens: Tokens;
	defaults: Required<Defaults>;
};
