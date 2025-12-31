import { DEFAULT_SETTINGS } from "@atlas/constants";
import { parseError } from "@atlas/functions/parse-error";
import type { Settings } from "@atlas/models";
import { load } from "@tauri-apps/plugin-store";

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
