import { computed, inject, Injectable, linkedSignal, signal, Signal } from "@angular/core";
import { createProduct, fetchProduct } from "../../commands";
import { Defaults, NewProduct, Tokens } from "../../models";
import { Product, ProductState } from "../../types";
import { ProductModalService } from "../../modals/product";
import { DocumentService } from "../document";

@Injectable({ providedIn: 'root' })
export class ProductService {
    readonly #documentService = inject(DocumentService);
    readonly #productModalService = inject(ProductModalService);

    readonly #productMap = computed(() => new Map(this.#documentService.documents()?.flatMap(document => document.lines.map(line => [line.product.id, line.product]))));
    readonly #products = linkedSignal<Product[]>(() => Array.from(this.#productMap().values()).map(product => ({ ...product, state: { status: 'pending' } })));
    readonly #hasErrors = computed(() => this.#products().some(product => product.state.status === 'error'));

    get products(): Signal<Product[]> {
        return this.#products;
    }

    get hasErrors(): Signal<boolean> {
        return this.#hasErrors;
    }

    async editProduct(product: Product): Promise<void> {
        await this.#productModalService.open(product).then((updatedProduct) => {
            if (updatedProduct) {
                this.#products.update((products) => products.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
            }
        });
    }

    async createProducts(tokens: Tokens, defaults: Defaults): Promise<Product[]> {
        this.#products.update((products) => products.map((product) => ({ ...product, state: product.state.status !== 'created' ? { status: 'creating' } : product.state })));
        const productCreations = this.#products()
            .filter((product) => product.state.status === 'creating')
            .map((product) => this.#fetchProduct(product.id, tokens)
                .catch(() => this.#createProduct(product, tokens, defaults))
                .then((productResult) => {
                    this.#products.update((products) => products.map((p) => p.id === productResult.id ? productResult : p));
                    return productResult;
                })
            );
        return Promise.all(productCreations);
    }

    async #fetchProduct(id: string, tokens: Tokens): Promise<Product> {
        return fetchProduct(id, tokens.secret, tokens.grant).then((fetchedProduct) => ({
            id,
            name: fetchedProduct.name,
            group: fetchedProduct.group,
            state: { status: 'created' },
        }));
    }

    async #createProduct(product: Product, tokens: Tokens, defaults: Defaults): Promise<Product> {
        const newProduct = toNewProduct(product, defaults);
        return createProduct(newProduct, tokens.secret, tokens.grant).then(
            () => fromNewProduct(newProduct, { status: 'created' }),
            (error) => fromNewProduct(newProduct, { status: 'error', errorMessage: error.message })
        );
    }
}

function fromNewProduct(product: NewProduct, state: ProductState): Product {
    return {
        id: product.id,
        name: product.name,
        group: product.group,
        state,
    };
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
