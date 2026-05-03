import type { BusinessDocumentCustomer } from './business-document-customer.model';
import type { DocumentModel } from './document.model';
import type { DocumentProduct } from './document-product.model';
import type { PrivateDocumentCustomer } from './private-document-customer.model';

export type Documents = {
	documents: DocumentModel[];
	privateCustomerMap: Record<string, PrivateDocumentCustomer>;
	businessCustomerMap: Record<string, BusinessDocumentCustomer>;
	productMap: Record<string, DocumentProduct>;
};
