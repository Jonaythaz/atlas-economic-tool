import { inject, Injectable } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import { Invoice } from "../../models";
import { InvoiceModalComponent } from "./invoice.modal-component";

@Injectable({ providedIn: "root" })
export class InvoiceModalService {
    readonly #modalController = inject(ModalController);

    async openInvoiceModal(invoice: Invoice): Promise<void> {
        await this.#modalController.showModal({
            component: InvoiceModalComponent,
            componentProps: { invoice },
            size: 'full-height'
        });
    }
}