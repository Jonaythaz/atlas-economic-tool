import { load } from "@tauri-apps/plugin-store";
import { Settings } from "../models/settings.model";

export async function updateSettings(settings: Settings): Promise<void> {
    await load("store.json").then(async (store) => {
        store.set("settings", settings);
        store.save();
    }).catch((errorMessage) => { throw new Error(`Failed to load settings store: ${errorMessage}`); });
}