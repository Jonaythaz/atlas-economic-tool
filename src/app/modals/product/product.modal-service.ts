import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { Product } from "../../types/product.type";
import { ProductModalComponent } from "./product.modal-component";
import { Defaults } from "../../models";
import { fetchSettings } from "../../commands";

@Injectable({ providedIn: "root" })
export class ProductModalService {
    readonly #modalController = inject(ModalController);

    async open(product: Product): Promise<Product | undefined> {
        const { defaults } = await fetchSettings();
        const config = this.#createConfig(product, defaults);
        return new Promise((resolve) => this.#modalController.showModal(config, resolve));
    }

    #createConfig(product: Product, defaults: Defaults): ModalConfig {
        return {
            component: ProductModalComponent,
            componentProps: { product, defaults },
            size: 'full-height'
        };
    }
}
