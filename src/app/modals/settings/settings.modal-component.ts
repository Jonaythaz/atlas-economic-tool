import { Component, computed, inject, resource, signal, Signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Modal, PageModule, CardModule, FormFieldModule, InputComponent, LoadingOverlayComponent, ModalFooterComponent, EmptyStateModule, ButtonComponent } from "@kirbydesign/designsystem";
import { fetchSettings, updateSettings } from "../../commands";
import { FormField, formField } from "../../utils/form-field";

type ViewModel = {
    isLoading: Signal<boolean>;
    error: Signal<string | undefined>;
    secretTokenField: FormField<string>;
    grantTokenField: FormField<string>;
    unsubmittable: Signal<boolean>;
    reload: () => void;
    submit: () => Promise<void>;
};

@Component({
    selector: "atlas-settings-modal",
    templateUrl: "./settings.modal-component.html",
    imports: [PageModule, ButtonComponent, CardModule, FormFieldModule, InputComponent, FormsModule, ModalFooterComponent, LoadingOverlayComponent, EmptyStateModule],
})
export class SettingsModalComponent {
    readonly #modal = inject(Modal);

    readonly #saving = signal<boolean>(false);

    readonly #settingsResource = resource({ loader: fetchSettings });
    readonly #secretToken = formField(
        () => this.#settingsResource.hasValue() ? this.#settingsResource.value().tokens.secret : '',
        (value) => value.trim().length === 0 ? 'Secret token is required' : null
    );
    readonly #grantToken = formField(
        () => this.#settingsResource.hasValue() ? this.#settingsResource.value().tokens.grant : '',
        (value) => value.trim().length === 0 ? 'Grant token is required' : null
    );
    readonly #formDirty = computed(() => this.#secretToken.isDirty() || this.#grantToken.isDirty());
    readonly #formInvalid = computed(() => this.#secretToken.isInvalid() || this.#grantToken.isInvalid());

    async #save(): Promise<void> {
        this.#saving.set(true);
        await updateSettings({ tokens: { secret: this.#secretToken(), grant: this.#grantToken() } });
        this.#saving.set(false);
        this.#modal.close();
    }

    readonly vm: ViewModel = {
        isLoading: computed(() => this.#settingsResource.isLoading() || this.#saving()),
        error: computed(() => this.#settingsResource.error()?.message),
        secretTokenField: this.#secretToken,
        grantTokenField: this.#grantToken,
        unsubmittable: computed(() => !this.#formDirty() || this.#formInvalid() || this.#saving()),
        reload: this.#settingsResource.reload.bind(this.#settingsResource),
        submit: this.#save.bind(this),
    };
}