import { invoke } from "@tauri-apps/api/core";
import { NewCustomer } from "../models";


export async function createCustomer(customer: NewCustomer, secret: string, grant: string): Promise<number> {
    return invoke<number>("create_customer", { customer, secret, grant }).catch((errorMessage) => {
        throw new Error(errorMessage);
    });
}