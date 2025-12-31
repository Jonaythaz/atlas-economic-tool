import { load } from "@tauri-apps/plugin-store";
import { parseError } from "../functions/parse-error";
import type { Settings } from "../models/settings.model";

export async function updateSettings(settings: Settings): Promise<void> {
	await load("store.json")
		.then(async (store) => {
			store.set("settings", settings);
			store.save();
		})
		.catch((error) => {
			throw parseError(error);
		});
}
