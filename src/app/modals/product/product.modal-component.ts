import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { Product } from "../../types/product.type";
import { CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ModalFooterComponent, Modal, InputComponent, ButtonComponent, LoadingOverlayComponent } from "@kirbydesign/designsystem";
import { FormField, formField } from "../../utils/form-field";
import { FormsModule } from "@angular/forms";
import { DISMISS_ALERT_CONFIG } from "../../constants";
import { Defaults } from "../../models";

export type ComponentProps = {
    product: Product;
    defaults: Defaults;
};

type ViewModel = {
    id: string;
    isLoading: Signal<boolean>;
    uneditable: boolean;
    nameField: FormField<string>;
    groupField: FormField<number | undefined>;
    unsubmittable: Signal<boolean>;
    errorMessage: Signal<string | undefined>;
    submit: () => Promise<void>;
};

@Component({
    templateUrl: "./product.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, InputComponent, ModalFooterComponent, FormsModule, ButtonComponent, LoadingOverlayComponent]
})
export class ProductModalComponent {
    readonly #modal = inject(Modal);
    readonly #props = inject<ComponentProps>(COMPONENT_PROPS);

    readonly #product = this.#props.product;
    readonly #defaults = this.#props.defaults;

    readonly #isLoading = signal(false);
    readonly #errorMessage = signal(this.#product.state.status === 'error' ? this.#product.state.errorMessage : undefined);

    readonly #name = formField(
        () => this.#product.name,
        (name) => name.trim().length === 0 ? 'Product name is required' : null
    );
    readonly #group = formField(
        () => this.#product.group ?? this.#defaults.productGroup,
        (group) => group === undefined ? 'Product group is required' : null
    );
    readonly #formDirty = computed(() => this.#name.isDirty() || this.#group.isDirty());
    readonly #formInvalid = computed(() => this.#name.isInvalid() || this.#group.isInvalid());

    constructor() {
        this.#modal.canDismiss = computed(() => this.#formDirty() ? DISMISS_ALERT_CONFIG : true);
    }

    async #submit(): Promise<void> {
        await this.#closeModal(this.#buildProduct());
    }

    async #closeModal(product: Product): Promise<void> {
        this.#modal.canDismiss = () => true;
        await this.#modal.close(product);
    }

    #buildProduct(): Product {
        return {
            ...this.#product,
            name: this.#name().trim(),
            group: this.#group(),
        };
    }

    readonly vm: ViewModel = {
        id: this.#product.id,
        isLoading: this.#isLoading,
        uneditable: this.#product.state.status === 'created',
        nameField: this.#name,
        groupField: this.#group,
        errorMessage: this.#errorMessage,
        unsubmittable: computed(() => !this.#formDirty() || this.#formInvalid()),
        submit: this.#submit.bind(this),
    };
}
