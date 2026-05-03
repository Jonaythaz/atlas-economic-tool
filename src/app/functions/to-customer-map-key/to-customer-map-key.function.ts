import type { CustomerReference } from '@atlas/types';

export function toCustomerMapKey(customer: CustomerReference): string {
	return `${customer.type}:${customer.type === 'private' ? customer.cpr : customer.ean}`;
}
