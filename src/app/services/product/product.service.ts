import { computed, inject, Injectable, linkedSignal, Signal } from "@angular/core";
import { createProduct, fetchProduct } from "../../commands";
import { Defaults, NewProduct, Settings } from "../../models";
import { Product, ProductResource } from "../../types";
import { DocumentService } from "../document";
import { createResources } from "../../functions/create-resources";

@Injectable({ providedIn: 'root' })
export class ProductService {
    readonly #documentService = inject(DocumentService);

    readonly #productMap = computed(() => new Map(this.#documentService.documents()?.flatMap(document => document.lines.map(line => [line.product.id, line.product]))));
    readonly #products = linkedSignal<ProductResource[]>(() => Array.from(this.#productMap().values()).map(product => ({ model: product, status: 'pending' })));
    readonly #hasErrors = computed(() => this.#products().some(product => product.status === 'error'));

    get products(): Signal<ProductResource[]> {
        return this.#products;
    }

    get hasErrors(): Signal<boolean> {
        return this.#hasErrors;
    }

    async createProduct(product: Product, settings: Settings): Promise<void> {
        await this.#createProduct(product, settings).then(
            (createdProduct) => this.#updateProduct({ model: createdProduct, status: 'created' }),
            (error) => {
                const message = error instanceof Error ? error.message : 'Unexpected error occured.';
                this.#updateProducts((p) => 
                    p.model.id === product.id ? { ...p, status: 'error', message } : p
                );
            }
        );
    }

    async createProducts(settings: Settings): Promise<boolean> {
        return createResources({
            resources: this.#products,
            createFn: (product) => this.#createProduct(product, settings),
            equalFn: (p1, p2) => p1.id === p2.id
        });
    }

    async #createProduct(product: Product, settings: Settings): Promise<Product> {
        const fetchedProduct = await fetchProduct(product.id, settings.tokens);
        if (fetchedProduct) {
            return fetchedProduct;
        }
        const newProduct = toNewProduct(product, settings.defaults);
        await createProduct(newProduct, settings.tokens);
        return newProduct;
    }

    #updateProduct(updatedProduct: ProductResource): void {
        this.#updateProducts((product) => 
            updatedProduct.model.id === product.model.id ? updatedProduct : product
        );
    }

    #updateProducts(updateFn: (resource: ProductResource) => ProductResource): void {
        this.#products.update((products) => products.map(updateFn));
    }
}

function toNewProduct(product: Product, defaults: Defaults): NewProduct {
    const group = product.group ?? defaults.productGroup;
    if (group === undefined) {
        throw new Error('Could not create product because of missing default value.');
    }
    return {
        id: product.id,
        name: product.name,
        group,
    };
}
