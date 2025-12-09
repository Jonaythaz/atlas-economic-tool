import { computed, inject, Injectable, resource, signal, Signal } from "@angular/core";
import { fetchSettings, updateSettings } from "../../commands";
import { Settings } from "../../models/settings.model";
import { ToastController } from "@kirbydesign/designsystem";

@Injectable({ providedIn: "root" })
export class SettingsService {
    readonly #saving = signal<boolean>(false);
    readonly #settingsResource = resource({ loader: fetchSettings });

    readonly #settings = computed(() => this.#settingsResource.hasValue() ? this.#settingsResource.value() : undefined);
    readonly #error = computed(() => this.#settingsResource.error()?.message);

    get settings(): Signal<Settings | undefined> {
        return this.#settings;
    }

    get error(): Signal<string | undefined> {
        return this.#error;
    }

    get isLoading(): Signal<boolean> {
        return this.#settingsResource.isLoading;
    }

    get saving(): Signal<boolean> {
        return this.#saving;
    }

    load(): void {
        this.#settingsResource.reload();
    }

    async save(settings: Settings): Promise<void> {
        this.#saving.set(true);
        await updateSettings(settings).then(() => this.#settingsResource.set(settings)).finally(() => this.#saving.set(false));
    }
}