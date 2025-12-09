import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { Customer } from "../../types";
import { CustomerModalComponent } from "./customer.modal-component";
import { Defaults } from "../../models";
import { fetchSettings } from "../../commands";

@Injectable({ providedIn: "root" })
export class CustomerModalService {
    readonly #modalController = inject(ModalController);

    async open(customer: Customer): Promise<Customer | undefined> {
        const { defaults } = await fetchSettings();
        const config = this.#createConfig(customer, defaults);
        return new Promise((resolve) => this.#modalController.showModal(config, resolve));
    }

    #createConfig(customer: Customer, defaults: Defaults): ModalConfig {
        return {
            component: CustomerModalComponent,
            componentProps: { customer, defaults },
            size: 'full-height'
        };
    }
}