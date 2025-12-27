import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { CustomerResource } from "../../types";
import { ComponentProps, CustomerModalComponent } from "./customer.modal-component";
import { fetchSettings } from "../../commands";

@Injectable({ providedIn: "root" })
export class CustomerModalService {
    readonly #modalController = inject(ModalController);

    async open(customer: CustomerResource): Promise<void> {
        const settings = await fetchSettings();
        const config = createConfig({ customer, settings });
        await this.#modalController.showModal(config);
    }
}

function createConfig(componentProps: ComponentProps): ModalConfig {
    return {
        component: CustomerModalComponent,
        size: 'full-height',
        componentProps
    };
}
