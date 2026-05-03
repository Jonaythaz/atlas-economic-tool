import type { BusinessCustomer } from './business-customer.type';
import type { PrivateCustomer } from './private-customer.type';

export type Customer = BusinessCustomer | PrivateCustomer;
