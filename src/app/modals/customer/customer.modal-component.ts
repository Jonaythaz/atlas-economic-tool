import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { CardModule, FormFieldModule, PageModule, ModalFooterComponent, Modal, InputComponent, ButtonComponent, LoadingOverlayComponent, FlagComponent, ToastController } from "@kirbydesign/designsystem";
import { FormField } from "../../utils/form-field";
import { FormsModule } from "@angular/forms";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import { CustomerFormService } from "../../services/customer-form";

type ViewModel = {
    id: Signal<string>;
    isLoading: Signal<boolean>;
    nameField: FormField<string>;
    groupField: FormField<number | null>;
    paymentTermsField: FormField<number | null>;
    vatZoneField: FormField<number | null>;
    externalIdField: FormField<number | null>;
    submitMessage: Signal<string>;
    uneditable: Signal<boolean>;
    unsubmittable: Signal<boolean>;
    errorMessage: Signal<string | undefined>;
    submit: () => Promise<void>;
};

@Component({
    templateUrl: "./customer.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, InputComponent, ModalFooterComponent, FormsModule, ButtonComponent, LoadingOverlayComponent, FlagComponent]
})
export class CustomerModalComponent {
    readonly #modal = inject(Modal);
    readonly #formService = inject(CustomerFormService);
    readonly #toastController = inject(ToastController);

    readonly #isLoading = signal(false);
    
    constructor() {
        this.#modal.canDismiss = computed(() => this.#formService.dirty() ? DISMISS_ALERT_CONFIG : true);
    }

    async #submit(): Promise<void> {
        this.#isLoading.set(true);
        this.#formService.submit()
            .then(this.#closeModal.bind(this))
            .catch((error) => this.#toastController.showToast({
                message: error instanceof Error ? error.message : 'Unexpected error occured',
                messageType: 'warning'
            }))
            .finally(() => {
                this.#isLoading.set(false)
            });
    }

    async #closeModal(): Promise<void> {
        this.#modal.canDismiss = () => true;
        await this.#modal.close();
    }

    readonly vm: ViewModel = {
        id: this.#formService.id,
        isLoading: this.#isLoading.asReadonly(),
        nameField: this.#formService.nameField,
        groupField: this.#formService.groupField,
        paymentTermsField: this.#formService.paymentTermsField,
        vatZoneField: this.#formService.vatZoneField,
        externalIdField: this.#formService.externalIdField,
        submitMessage: this.#formService.submitMessage,
        errorMessage: this.#formService.errorMessage,
        uneditable: this.#formService.uneditable,
        unsubmittable: computed(() => this.#formService.unsubmittable() || this.#isLoading()),
        submit: this.#submit.bind(this),
    };
}
