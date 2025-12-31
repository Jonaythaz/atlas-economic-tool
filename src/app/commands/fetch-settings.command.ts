import { load } from "@tauri-apps/plugin-store";
import { DEFAULT_SETTINGS } from "../constants";
import { parseError } from "../functions/parse-error";
import type { Settings } from "../models/settings.model";

export async function fetchSettings(): Promise<Settings> {
	return await load("store.json")
		.then((store) => store.get<Settings>("settings"))
		.then(
			(settings) => settings ?? DEFAULT_SETTINGS,
			(error) => {
				throw parseError(error);
			},
		);
}
