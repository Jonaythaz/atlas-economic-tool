import { inject, Injectable } from "@angular/core";
import { ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { CustomerResource } from "../../types";
import { CustomerModalComponent } from "./customer.modal-component";
import { fetchSettings } from "../../commands";
import { CustomerFormService } from "../../services/customer-form";

@Injectable({ providedIn: "root" })
export class CustomerModalService {
    readonly #modalController = inject(ModalController);
    readonly #formService = inject(CustomerFormService);

    async open(customer: CustomerResource): Promise<void> {
        const settings = await fetchSettings();
        this.#formService.initialize(customer, settings);
        await this.#modalController.showModal(CONFIG, () => this.#formService.uninitialize());
    }
}

const CONFIG: ModalConfig = {
    component: CustomerModalComponent,
    size: 'full-height'
};
