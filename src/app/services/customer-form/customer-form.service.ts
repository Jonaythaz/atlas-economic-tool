import { computed, effect, inject, Injectable, Signal, signal } from "@angular/core";
import { Customer, CustomerResource } from "../../types";
import { FormField, formField } from "../../utils/form-field";
import { Settings } from "../../models";
import { CustomerService } from "../customer";

@Injectable({ providedIn: 'root' })
export class CustomerFormService {
    readonly #customerService = inject(CustomerService);

    readonly #customer = signal<CustomerResource | undefined>(undefined);
    readonly #settings = signal<Settings | undefined>(undefined);

    readonly #errorMessage = computed(() => {
        const customer = this.#customer();
        return customer?.status === 'error' ? customer.message : undefined;
    });

    readonly #id = computed(() => this.#customer()?.model.id ?? '');
    readonly #nameField = formField(
        () => this.#customer()?.model.name ?? '',
        (name) => name.trim().length === 0 ? 'Customer name is required' : null
    );
    readonly #groupField = formField(
        () => this.#customer()?.model.group ?? this.#settings()?.defaults.customerGroup ?? null,
        (group) => group === null ? 'Customer group is required' : null
    );
    readonly #paymentTermsField = formField(
        () => this.#customer()?.model.paymentTerms ?? this.#settings()?.defaults.paymentTerms ?? null,
        (paymentTerms) => paymentTerms === null ? 'Payment terms is required' : null
    );
    readonly #vatZoneField = formField(
        () => this.#customer()?.model.vatZone ?? this.#settings()?.defaults.vatZone ?? null,
        (vatZone) => vatZone === null ? 'VAT zone is required' : null
    );
    readonly #externalIdField = formField(() => {
        const customer = this.#customer();
        return customer?.status === 'created' ? customer.model.externalId : null;
    });
    readonly #submitMessage = computed(() => this.#externalIdField() === null ? 'Create' : 'Update');

    readonly #dirty = computed(() => this.#nameField.isDirty() || this.#groupField.isDirty() || this.#paymentTermsField.isDirty() || this.#vatZoneField.isDirty() || this.#externalIdField.isDirty());
    readonly #invalid = computed(() => this.#externalIdField() === null && (this.#nameField.isInvalid() || this.#groupField.isInvalid() || this.#paymentTermsField.isInvalid() || this.#vatZoneField.isInvalid()));
    readonly #unsubmittable = computed(() => this.#invalid() || (this.#customer()?.status === 'created' && !this.#dirty()));
    readonly #uneditable = computed(() => this.#customer()?.status === 'created' || !!this.#externalIdField());

    constructor() {
        effect(() => {
            console.log('group is invalid:', this.#groupField.isInvalid(), 'with value:', this.#groupField());
            console.log('form is invalid:', this.#invalid());
        });
    }

    get errorMessage(): Signal<string | undefined> {
        return this.#errorMessage;
    }

    get id(): Signal<string> {
        return this.#id;
    }

    get nameField(): FormField<string> {
        return this.#nameField;
    }

    get groupField(): FormField<number | null> {
        return this.#groupField;
    }

    get paymentTermsField(): FormField<number | null> {
        return this.#paymentTermsField;
    }

    get vatZoneField(): FormField<number | null> {
        return this.#vatZoneField;
    }

    get externalIdField(): FormField<number | null> {
        return this.#externalIdField;
    }

    get submitMessage(): Signal<string> {
        return this.#submitMessage;
    }

    get dirty(): Signal<boolean> {
        return this.#dirty;
    }

    get invalid(): Signal<boolean> {
        return this.#invalid;
    }
    
    get unsubmittable(): Signal<boolean> {
        return this.#unsubmittable;
    }

    get uneditable(): Signal<boolean> {
        return this.#uneditable;
    }

    initialize(customer: CustomerResource, settings: Settings): void {
        this.#customer.set(customer);
        this.#settings.set(settings);
    }

    uninitialize(): void {
        this.#customer.set(undefined);
    }

    async submit(): Promise<void> {
        const customer = this.#customer();
        const settings = this.#settings();
        if (!customer || !settings) {
            throw new Error('It is not possible to build a non-existant customer.');
        }
        const externalId = this.#externalIdField();
        if (externalId) {
            await this.#customerService.updateCustomer(customer.model.id, externalId);
        }
        const model = this.#buildCustomer(customer.model.id);
        await this.#customerService.createCustomer(model, settings);
    }

    #buildCustomer(id: string): Customer {
        return {
            id,
            name: this.#nameField().trim(),
            group: this.#groupField() ?? undefined,
            paymentTerms: this.#paymentTermsField() ?? undefined,
            vatZone: this.#vatZoneField() ?? undefined,
        };
    }
}