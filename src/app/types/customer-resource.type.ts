import { CreatedCustomer } from "./created-customer.type";
import { Customer } from "./customer.type";
import { DocumentResource } from "./document-resource.type";

export type CustomerResource = DocumentResource<Customer, CreatedCustomer>;
