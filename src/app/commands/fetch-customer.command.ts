import { invoke } from "@tauri-apps/api/core";
import { CustomerModel, Tokens } from "../models";
import { parseError } from "../functions/parse-error";

export function fetchCustomer(id: number, tokens: Tokens): Promise<CustomerModel | null> {
    return invoke<CustomerModel | null>("fetch_customer", { id, tokens }).catch((error) => {
        throw parseError(error);
    });
}
