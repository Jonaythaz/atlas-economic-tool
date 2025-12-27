import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { CardModule, FormFieldModule, PageModule, ModalFooterComponent, Modal, InputComponent, ButtonComponent, LoadingOverlayComponent, FlagComponent, ToastController } from "@kirbydesign/designsystem";
import { FormField } from "../../utils/form-field";
import { FormsModule } from "@angular/forms";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import { ProductFormService } from "../../services/product-form";

type ViewModel = {
    id: Signal<string>;
    errorMessage: Signal<string | undefined>;
    isLoading: Signal<boolean>;
    nameField: FormField<string>;
    groupField: FormField<number | null>;
    uneditable: Signal<boolean>;
    unsubmittable: Signal<boolean>;
    submit: () => Promise<void>;
};

@Component({
    templateUrl: "./product.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, InputComponent, ModalFooterComponent, FormsModule, ButtonComponent, LoadingOverlayComponent, FlagComponent]
})
export class ProductModalComponent {
    readonly #modal = inject(Modal);
    readonly #formService = inject(ProductFormService);
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
            .finally(() => this.#isLoading.set(false));
    }

    async #closeModal(): Promise<void> {
        this.#modal.canDismiss = () => true;
        await this.#modal.close();
    }

    readonly vm: ViewModel = {
        id: this.#formService.id,
        errorMessage: this.#formService.errorMessage,
        isLoading: this.#isLoading.asReadonly(),
        nameField: this.#formService.nameField,
        groupField: this.#formService.groupField,
        uneditable: this.#formService.uneditable,
        unsubmittable: computed(() => this.#formService.unsubmittable() || this.#isLoading()),
        submit: this.#submit.bind(this),
    };
}
