import { inject, Injectable } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import { CreditNoteModalComponent } from "./credit-note.modal-component";
import { CreditNote } from "../../types";

@Injectable({ providedIn: "root" })
export class CreditNoteModalService {
    readonly #modalController = inject(ModalController);

    async openCreditNoteModal(creditNote: CreditNote): Promise<void> {
        await this.#modalController.showModal({
            component: CreditNoteModalComponent,
            componentProps: { creditNote },
            size: 'full-height'
        });
    }
}