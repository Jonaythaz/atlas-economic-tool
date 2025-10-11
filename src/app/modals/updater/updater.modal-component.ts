import { Component, computed, inject, signal, Signal } from "@angular/core";
import { UpdaterService } from "../../services/updater";
import { ButtonComponent, EmptyStateModule, Modal, ProgressCircleComponent } from "@kirbydesign/designsystem";
import { DecimalPipe } from "@angular/common";

type ViewModel = {
    updateAvailable: Signal<boolean>;
    updateProgress: Signal<number | null>;
    startUpdate: () => Promise<void>;
    dismiss: () => Promise<void>;
}

@Component({
    selector: 'app-updater-modal',
    templateUrl: './updater.modal-component.html',
    imports: [ProgressCircleComponent, EmptyStateModule, ButtonComponent, DecimalPipe],
})
export class UpdaterModalComponent {
    readonly #modal = inject(Modal);
    readonly #updaterService = inject(UpdaterService);

    async #performUpdate(): Promise<void> {
        await this.#updaterService.performUpdate();
    }

    async #dismiss(): Promise<void> {
        await this.#modal.close();
    }

    readonly vm: ViewModel = {
        updateAvailable: this.#updaterService.updateAvailable,
        updateProgress: this.#updaterService.downloadProcent,
        startUpdate: this.#performUpdate.bind(this),
        dismiss: this.#dismiss.bind(this),
    };
}
