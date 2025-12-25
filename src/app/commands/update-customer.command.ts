import { invoke } from "@tauri-apps/api/core";
import { parseError } from "../functions/parse-error";

export async function updateCustomer(id: string, externalId: number): Promise<void> {
    await invoke("update_customer", { request: { id, externalId } }).catch((error) => {
        throw parseError(error);
    });
}