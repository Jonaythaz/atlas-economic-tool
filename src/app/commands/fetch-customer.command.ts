import { invoke } from "@tauri-apps/api/core";
import { CustomerModel } from "../models";

export function fetchCustomer(id: number, secret: string, grant: string): Promise<CustomerModel> {
    return invoke<CustomerModel>("fetch_customer", { id, secret, grant }).catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}