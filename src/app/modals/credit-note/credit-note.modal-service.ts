import { Injectable, inject } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import type { CreditNoteResource } from "../../types";
import { CreditNoteModalComponent } from "./credit-note.modal-component";

@Injectable({ providedIn: "root" })
export class CreditNoteModalService {
	readonly #modalController = inject(ModalController);

	async openCreditNoteModal(creditNote: CreditNoteResource): Promise<void> {
		await this.#modalController.showModal({
			component: CreditNoteModalComponent,
			componentProps: { creditNote },
			size: "full-height",
		});
	}
}
