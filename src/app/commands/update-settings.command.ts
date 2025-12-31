import { parseError } from "@atlas/functions/parse-error";
import type { Settings } from "@atlas/models";
import { load } from "@tauri-apps/plugin-store";

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
