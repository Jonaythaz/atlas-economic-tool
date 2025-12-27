import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { Product, ProductResource } from "../../types";
import { FormField, formField } from "../../utils/form-field";
import { Settings } from "../../models";
import { ProductService } from "../product";

@Injectable({ providedIn: 'root' })
export class ProductFormService {
    readonly #productService = inject(ProductService);

    readonly #product = signal<ProductResource | undefined>(undefined);
    readonly #settings = signal<Settings | undefined>(undefined);
    
    readonly #errorMessage = computed(() => {
        const product = this.#product();
        return product?.status === 'error' ? product.message : undefined;
    });

    readonly #id = computed(() => this.#product()?.model.id ?? '');
    readonly #nameField = formField(
        () => this.#product()?.model.name ?? '',
        (name) => name.trim().length === 0 ? 'Product name is required' : null
    );
    readonly #groupField = formField(
        () => this.#product()?.model.group ?? this.#settings()?.defaults.productGroup ?? null,
        (group) => group === null ? 'Product group is required' : null
    );
    readonly #submitMessage = computed(() => this.#product()?.status === 'created' ? 'Update' : 'Create');
    readonly #dirty = computed(() => this.#nameField.isDirty() || this.#groupField.isDirty());
    readonly #invalid = computed(() => this.#nameField.isInvalid() || this.#groupField.isInvalid());
    readonly #unsubmittable = computed(() => this.#invalid() || (this.#product()?.status === 'created' && !this.#dirty()));
    readonly #uneditable = computed(() => this.#product()?.status === 'created');

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

    initialize(product: ProductResource, settings: Settings): void {
        this.#product.set(product);
        this.#settings.set(settings);
    }

    uninitialize(): void {
        this.#product.set(undefined);
    }

    async submit(): Promise<void> {
        const product = this.#product();
        const settings = this.#settings();
        if (!product || !settings) {
            throw new Error('It is not possible to create a non-existant product.');
        }
        const model = this.#buildProduct(product.model.id);
        await this.#productService.createProduct(model, settings);
    }

    #buildProduct(id: string): Product {
        return {
            id: id,
            name: this.#nameField().trim(),
            group: this.#groupField() ?? undefined,
        };
    }
}