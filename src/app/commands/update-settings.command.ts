import { load } from "@tauri-apps/plugin-store";
import { Settings } from "../models/settings.model";
import { parseError } from "../functions/parse-error";

export async function updateSettings(settings: Settings): Promise<void> {
    await load("store.json").then(async (store) => {
        store.set("settings", settings);
        store.save();
    }).catch((error) => { throw parseError(error); });
}