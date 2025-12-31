import { Injectable, inject } from "@angular/core";
import { type ModalConfig, ModalController } from "@kirbydesign/designsystem";
import { fetchSettings } from "../../commands";
import type { CustomerResource } from "../../types";
import { type ComponentProps, CustomerModalComponent } from "./customer.modal-component";

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
		size: "full-height",
		componentProps,
	};
}
