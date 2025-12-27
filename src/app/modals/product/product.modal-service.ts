import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { ProductResource } from "../../types/product-resource.type";
import { ComponentProps, ProductModalComponent } from "./product.modal-component";
import { fetchSettings } from "../../commands";

@Injectable({ providedIn: "root" })
export class ProductModalService {
    readonly #modalController = inject(ModalController);

    async open(product: ProductResource): Promise<void> {
        const settings = await fetchSettings();
        const config = createConfig({ product, settings });
        await this.#modalController.showModal(config);
    }
}

function createConfig(componentProps: ComponentProps): ModalConfig {
    return {
        component: ProductModalComponent,
        size: 'full-height',
        componentProps
    };
}
