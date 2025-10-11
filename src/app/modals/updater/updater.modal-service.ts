import { ModalController } from "@kirbydesign/designsystem";
import { UpdaterModalComponent } from "./updater.modal-component";
import { inject, Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class UpdaterModalService {
    readonly #modalController = inject(ModalController);

    async open(): Promise<void> {
        await this.#modalController.showModal({
            component: UpdaterModalComponent,
            flavor: 'compact'
        });
    }
}