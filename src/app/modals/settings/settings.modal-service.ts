import { inject, Injectable } from "@angular/core";
import { ModalController } from "@kirbydesign/designsystem";
import { SettingsModalComponent } from "./settings.modal-component";

@Injectable({ providedIn: "root" })
export class SettingsModalService {
    readonly #modalController = inject(ModalController);

    async open(): Promise<void> {
        await this.#modalController.showModal({
            component: SettingsModalComponent,
            size: 'large'
        });
    }
}