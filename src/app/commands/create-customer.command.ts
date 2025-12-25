import { invoke } from "@tauri-apps/api/core";
import { NewCustomer, Tokens } from "../models";
import { parseError } from "../functions/parse-error";


export async function createCustomer(localId: string, newCustomer: NewCustomer, tokens: Tokens): Promise<number> {
    return invoke<number>("create_customer", { request: { localId, newCustomer, tokens } }).catch((error) => {
        throw parseError(error);
    });
}
