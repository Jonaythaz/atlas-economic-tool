import { load } from '@tauri-apps/plugin-store';
import { Settings } from "../models/settings.model";

export async function fetchSettings(): Promise<Settings> {
    return await load("store.json")
        .then((store) => store.get<Settings>("settings"))
        .then(
            (settings) => settings ?? DEFAULT_SETTINGS,
            (errorMessage) => { throw new Error(`Failed to fetch settings: ${errorMessage}`); }
        );
}

const DEFAULT_SETTINGS: Settings = {
    tokens: {
        secret: '',
        grant: '',
    },
};