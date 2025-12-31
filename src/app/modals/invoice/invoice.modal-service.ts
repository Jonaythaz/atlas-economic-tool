import { Injectable, inject } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import type { InvoiceResource } from "../../types";
import { InvoiceModalComponent } from "./invoice.modal-component";

@Injectable({ providedIn: "root" })
export class InvoiceModalService {
	readonly #modalController = inject(ModalController);

	async openInvoiceModal(invoice: InvoiceResource): Promise<void> {
		await this.#modalController.showModal({
			component: InvoiceModalComponent,
			componentProps: { invoice },
			size: "full-height",
		});
	}
}
