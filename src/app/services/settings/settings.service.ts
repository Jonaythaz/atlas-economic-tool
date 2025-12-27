import { computed, Injectable, resource, Signal } from "@angular/core";
import { fetchSettings } from "../../commands";
import { Settings } from "../../models";

@Injectable({ providedIn: "root" })
export class SettingsService {
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

    load(): void {
        this.#settingsResource.reload();
    }
}
