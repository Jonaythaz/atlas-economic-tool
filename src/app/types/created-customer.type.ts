import { Customer } from "./customer.type";

export type CreatedCustomer = Customer & { externalId: number };