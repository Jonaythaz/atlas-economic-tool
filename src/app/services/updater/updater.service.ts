import { computed, Injectable, resource, signal, Signal } from "@angular/core";
import { check, Update } from "@tauri-apps/plugin-updater";

@Injectable({ providedIn: 'root' })
export class UpdaterService {
    readonly #downloadSize = signal<number | null>(null);
    readonly #downloadProgress = signal<number>(0);
    readonly #updateResource = resource({ loader: () => check(), defaultValue: null });

    readonly #updateAvailable = computed(() => this.#updateResource.hasValue() && this.#updateResource.value() !== null);
    readonly #downloadProcent = computed(() => {
        const size = this.#downloadSize();
        return size ? this.#downloadProgress() / size * 100 : null;
    });

    get updateAvailable(): Signal<boolean> {
        return this.#updateAvailable;
    }

    get downloadProcent(): Signal<number | null> {
        return this.#downloadProcent;
    }

    async performUpdate(): Promise<void> {
        const update = this.#updateResource.value();
        if (update === null) {
            throw new Error('No update available');
        }
        await update.downloadAndInstall((download) => {
            switch (download.event) {
                case 'Started':
                    this.#downloadSize.set(download.data.contentLength ?? null);
                    break;
                case 'Progress':
                    this.#downloadProgress.update((current) => current + download.data.chunkLength);
                    break;
            }
        });
    }
}