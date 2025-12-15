import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { Customer, CustomerState } from "../../types";
import { CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ModalFooterComponent, Modal, InputComponent, ButtonComponent, LoadingOverlayComponent, FlagComponent } from "@kirbydesign/designsystem";
import { FormField, formField } from "../../utils/form-field";
import { FormsModule } from "@angular/forms";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import { Defaults } from "../../models";

export type ComponentProps = {
    customer: Customer;
    defaults: Defaults;
};

type ViewModel = {
    id: string;
    isLoading: Signal<boolean>;
    uneditable: boolean;
    nameField: FormField<string>;
    groupField: FormField<number | undefined>;
    paymentTermsField: FormField<number | undefined>;
    vatZoneField: FormField<number | undefined>;
    externalIdField: FormField<number | undefined>;
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
    readonly #props = inject<ComponentProps>(COMPONENT_PROPS);

    readonly #customer = this.#props.customer;
    readonly #defaults = this.#props.defaults;

    readonly #isLoading = signal(false);
    readonly #errorMessage = signal(this.#customer.state.status === 'error' ? this.#customer.state.errorMessage : undefined);
    readonly #name = formField(
        () => this.#customer.name,
        (name) => name.trim().length === 0 ? 'Customer name is required' : null
    );
    readonly #group = formField(
        () => this.#customer.group ?? this.#defaults.customerGroup,
        (group) => group === undefined ? 'Customer group is required' : null
    );
    readonly #paymentTerms = formField(
        () => this.#customer.paymentTerms ?? this.#defaults.paymentTerms,
        (paymentTerms) => paymentTerms === undefined ? 'Payment terms is required' : null
    );
    readonly #vatZone = formField(
        () => this.#customer.vatZone ?? this.#defaults.vatZone,
        (vatZone) => vatZone === undefined ? 'VAT zone is required' : null
    );
    readonly #externalId = formField(() => this.#customer.state.status === 'created' ? this.#customer.state.externalId : undefined);

    readonly #formDirty = computed(() => this.#name.isDirty() || this.#group.isDirty() || this.#paymentTerms.isDirty() || this.#vatZone.isDirty() || this.#externalId.isDirty());
    readonly #formInvalid = computed(() => this.#externalId === undefined && (this.#name.isInvalid() || this.#group.isInvalid() || this.#paymentTerms.isInvalid() || this.#vatZone.isInvalid()));
    
    constructor() {
        this.#modal.canDismiss = computed(() => this.#formDirty() ? DISMISS_ALERT_CONFIG : true);
    }

    async #submit(): Promise<void> {
        const updatedCustomer = this.#buildCustomer();
        await this.#closeModal(updatedCustomer);
    }

    async #closeModal(customer: Customer): Promise<void> {
        this.#modal.canDismiss = () => true;
        await this.#modal.close(customer);
    }

    #buildCustomer(): Customer {
        const externalId = this.#externalId();
        const state = externalId ? { status: 'created', externalId } satisfies CustomerState : this.#customer.state;
        return {
            ...this.#customer,
            name: this.#name().trim(),
            group: this.#group(),
            paymentTerms: this.#paymentTerms(),
            vatZone: this.#vatZone(),
            state
        };
    }

    readonly vm: ViewModel = {
        id: this.#customer.id,
        isLoading: this.#isLoading,
        uneditable: this.#customer.state.status === 'created',
        nameField: this.#name,
        groupField: this.#group,
        paymentTermsField: this.#paymentTerms,
        vatZoneField: this.#vatZone,
        externalIdField: this.#externalId,
        errorMessage: this.#errorMessage,
        unsubmittable: computed(() => !this.#formDirty() || this.#formInvalid()),
        submit: this.#submit.bind(this),
    };
}
