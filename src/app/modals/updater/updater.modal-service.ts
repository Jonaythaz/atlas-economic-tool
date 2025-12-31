import { Injectable, inject } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import { UpdaterModalComponent } from "./updater.modal-component";

@Injectable({ providedIn: "root" })
export class UpdaterModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: UpdaterModalComponent,
			flavor: "compact",
		});
	}
}
