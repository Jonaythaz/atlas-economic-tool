import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { CardModule, FormFieldModule, PageModule, ModalFooterComponent, Modal, InputComponent, ButtonComponent, LoadingOverlayComponent, FlagComponent, ToastController, COMPONENT_PROPS } from "@kirbydesign/designsystem";
import { FormsModule } from "@angular/forms";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import { disabled, Field, FieldTree, form, readonly, required } from "@angular/forms/signals";
import { Customer, CustomerResource } from "../../types";
import { Settings } from "../../models";
import { CustomerService } from "../../services/customer";

export type ComponentProps = {
    customer: CustomerResource;
    settings: Settings;
}

type ViewModel = {
    form: FieldTree<Required<Customer>>;
    errorMessage: string | null;
    isLoading: Signal<boolean>;
    unsubmittable: Signal<boolean>;
    submitMessage: Signal<string>;
    submit: () => Promise<void>;
};

@Component({
    templateUrl: "./customer.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, InputComponent, Field, ModalFooterComponent, FormsModule, ButtonComponent, LoadingOverlayComponent, FlagComponent]
})
export class CustomerModalComponent {
    readonly #modal = inject(Modal);
    readonly #props = inject<ComponentProps>(COMPONENT_PROPS);
    readonly #customerService = inject(CustomerService);
    readonly #toastController = inject(ToastController);

    readonly #errorMessage = this.#props.customer.status === 'error' ? this.#props.customer.message : null;

    readonly #isLoading = signal(false);
    readonly #model = signal<Required<Customer>>({
        ...this.#props.customer.model,
        group: this.#props.customer.model.group ?? this.#props.settings.defaults.customerGroup ?? NaN,
        paymentTerms: this.#props.customer.model.paymentTerms ?? this.#props.settings.defaults.paymentTerms ?? NaN,
        vatZone: this.#props.customer.model.vatZone ?? this.#props.settings.defaults.vatZone ?? NaN,
        externalId: this.#props.customer.model.externalId ?? NaN
    });
    readonly #form = form(this.#model, (schema) => {
        readonly(schema.id);
        required(schema.name, { message: 'Customer name is required' });
        disabled(schema.name, ({ valueOf }) => !isNaN(valueOf(schema.externalId)));
        required(schema.group, { message: 'Customer group is required' });
        disabled(schema.group, ({ valueOf }) => !isNaN(valueOf(schema.externalId)));
        required(schema.paymentTerms, { message: 'Payment terms is required' });
        disabled(schema.paymentTerms, ({ valueOf }) => !isNaN(valueOf(schema.externalId)));
        required(schema.vatZone, { message: 'VAT zone is required' });
        disabled(schema.vatZone, ({ valueOf }) => !isNaN(valueOf(schema.externalId)));
    });
    readonly #unsubmittable = computed(() => this.#form().invalid() || this.#isLoading());
    readonly #submitMessage = computed(() => isNaN(this.#form.externalId().value()) ? 'Create' : 'Update');
    
    constructor() {
        this.#modal.canDismiss = computed(() => this.#form().dirty() ? DISMISS_ALERT_CONFIG : true);
    }

    async #submit(): Promise<void> {
        this.#isLoading.set(true);
        this.#submitCustomer()
            .then(this.#closeModal.bind(this))
            .catch((error) => this.#toastController.showToast({
                message: error instanceof Error ? error.message : 'Unexpected error occured',
                messageType: 'warning'
            }))
            .finally(() => {
                this.#isLoading.set(false)
            });
    }

    async #submitCustomer(): Promise<void> {
        const formValue = this.#form().value();
        if (isNaN(formValue.externalId)) {
            await this.#customerService.createCustomer(formValue, this.#props.settings);
        } else {
            await this.#customerService.updateCustomer(formValue.id, formValue.externalId);
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
