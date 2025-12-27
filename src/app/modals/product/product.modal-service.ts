import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { ProductResource } from "../../types/product-resource.type";
import { ProductModalComponent } from "./product.modal-component";
import { fetchSettings } from "../../commands";
import { ProductFormService } from "../../services/product-form";

@Injectable({ providedIn: "root" })
export class ProductModalService {
    readonly #modalController = inject(ModalController);
    readonly #formService = inject(ProductFormService);

    async open(product: ProductResource): Promise<void> {
        const settings = await fetchSettings();
        this.#formService.initialize(product, settings);
        await this.#modalController.showModal(CONFIG, () => this.#formService.uninitialize());
    }
}

const CONFIG: ModalConfig = {
    component: ProductModalComponent,
    size: 'full-height'
};
