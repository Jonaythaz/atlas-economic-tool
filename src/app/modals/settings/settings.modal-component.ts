import { ChangeDetectionStrategy, Component, computed, inject, Signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Modal, PageModule, CardModule, FormFieldModule, InputComponent, LoadingOverlayComponent, ModalFooterComponent, EmptyStateModule, ButtonComponent, SectionHeaderComponent, AlertConfig, ToastController } from "@kirbydesign/designsystem";
import { FormField, formField } from "../../utils/form-field";
import { SettingsService } from "../../services/settings";
import { DISMISS_ALERT_CONFIG } from "../../constants";

type ViewModel = {
    isLoading: Signal<boolean>;
    error: Signal<string | undefined>;
    secretTokenField: FormField<string>;
    grantTokenField: FormField<string>;
    defaultCustomerGroupField: FormField<number | undefined>;
    defaultProductGroupField: FormField<number | undefined>;
    defaultLayoutField: FormField<number | undefined>;
    defaultPaymentTermsField: FormField<number | undefined>;
    defaultVatZoneField: FormField<number | undefined>;
    unsubmittable: Signal<boolean>;
    reload: () => void;
    submit: () => Promise<void>;
};

@Component({
    selector: "atlas-settings-modal",
    templateUrl: "./settings.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, ButtonComponent, CardModule, FormFieldModule, InputComponent, FormsModule, ModalFooterComponent, LoadingOverlayComponent, EmptyStateModule, SectionHeaderComponent],
})
export class SettingsModalComponent {
    readonly #modal = inject(Modal);
    readonly #settingsService = inject(SettingsService);
    readonly #toastController = inject(ToastController);

    readonly #secretToken = formField(
        () => this.#settingsService.settings()?.tokens.secret ?? '',
        (value) => value.trim().length === 0 ? 'Secret token is required' : null
    );
    readonly #grantToken = formField(
        () => this.#settingsService.settings()?.tokens.grant ?? '',
        (value) => value.trim().length === 0 ? 'Grant token is required' : null
    );
    readonly #defaultCustomerGroup = formField(
        () => this.#settingsService.settings()?.defaults?.customerGroup
    );
    readonly #defaultProductGroup = formField(
        () => this.#settingsService.settings()?.defaults?.productGroup
    );
    readonly #defaultLayout = formField(
        () => this.#settingsService.settings()?.defaults?.layout
    );
    readonly #defaultPaymentTerms = formField(
        () => this.#settingsService.settings()?.defaults?.paymentTerms
    );
    readonly #defaultVatZone = formField(
        () => this.#settingsService.settings()?.defaults?.vatZone
    );
    readonly #formDirty = computed(() => this.#secretToken.isDirty() || this.#grantToken.isDirty() || this.#defaultCustomerGroup.isDirty() || this.#defaultProductGroup.isDirty() || this.#defaultVatZone.isDirty() || this.#defaultPaymentTerms.isDirty() || this.#defaultLayout.isDirty());
    readonly #formInvalid = computed(() => this.#secretToken.isInvalid() || this.#grantToken.isInvalid());

    constructor() {
        this.#modal.canDismiss = computed(() => {
            if (this.#settingsService.saving()) {
                return false;
            }
            return this.#formDirty() ? DISMISS_ALERT_CONFIG : true;
        });
    }

    async #save(): Promise<void> {
        await this.#settingsService.save({ 
            tokens: {
                secret: this.#secretToken(),
                grant: this.#grantToken()
            },
            defaults: {
                customerGroup: this.#defaultCustomerGroup(),
                productGroup: this.#defaultProductGroup(),
                layout: this.#defaultLayout(),
                paymentTerms: this.#defaultPaymentTerms(),
                vatZone: this.#defaultVatZone(),
            }
        }).then(
            async () => {
                this.#modal.canDismiss = () => true;
                await this.#modal.close();
            },
            (error) => this.#toastController.showToast({
                message: `Was unable to save settings: ${error.message}`,
                messageType: 'warning'
            })
        );
    }

    readonly vm: ViewModel = {
        isLoading: computed(() => this.#settingsService.isLoading() || this.#settingsService.saving()),
        error: this.#settingsService.error,
        secretTokenField: this.#secretToken,
        grantTokenField: this.#grantToken,
        defaultCustomerGroupField: this.#defaultCustomerGroup,
        defaultProductGroupField: this.#defaultProductGroup,
        defaultLayoutField: this.#defaultLayout,
        defaultPaymentTermsField: this.#defaultPaymentTerms,
        defaultVatZoneField: this.#defaultVatZone,
        unsubmittable: computed(() => !this.#formDirty() || this.#formInvalid() || this.#settingsService.saving()),
        reload: this.#settingsService.load.bind(this.#settingsService),
        submit: this.#save.bind(this),
    };
}
