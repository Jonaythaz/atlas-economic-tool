import { Injectable, type Resource, resource } from '@angular/core';
import { loadDocuments } from '@atlas/commands';
import { deriveResource } from '@atlas/functions/derive-resource';
import { toCustomerMapKey } from '@atlas/functions/to-customer-map-key';
import type { Documents } from '@atlas/models';
import type { BusinessDocumentCustomer } from '@atlas/models/business-document-customer.model';
import type { PrivateDocumentCustomer } from '@atlas/models/private-document-customer.model';
import type { Customer } from '@atlas/types';
import { CustomerPipelineItem } from '@atlas/utils/customer-pipeline-item';
import { DocumentPipelineItem } from '@atlas/utils/document-pipeline-item';
import { type PipelineStep, pipelineStep } from '@atlas/utils/pipeline-step';
import { ProductPipelineItem } from '@atlas/utils/product-pipeline-item';

@Injectable({ providedIn: 'root' })
export class DocumentService {
	readonly #documents = resource({
		loader: ({ previous }) => (previous.status === 'idle' ? Promise.resolve(undefined) : loadDocuments()),
	});

	readonly #customerPipelineStep = pipelineStep(
		deriveResource({
			source: this.#documents,
			computation: (documents) =>
				Object.values(documents.privateCustomerMap)
					.map(toPrivateCustomer)
					.concat(Object.values(documents.businessCustomerMap).map(toBusinessCustomer))
					.map((customer) => new CustomerPipelineItem(customer, toCustomerMapKey(customer))),
		}),
	);

	readonly #productPipelineStep = pipelineStep(
		deriveResource({
			source: this.#documents,
			computation: (documents) =>
				Object.values(documents.productMap).map(
					(product) => new ProductPipelineItem({ ...product, group: null }, product.id),
				),
		}),
	);

	readonly #invoicePipelineStep = pipelineStep(
		deriveResource({
			source: this.#documents,
			computation: (documents) =>
				documents.documents.map((document) => new DocumentPipelineItem(document, document.id)),
		}),
	);

	get documents(): Resource<Documents | undefined> {
		return this.#documents;
	}

	get customerPipelineStep(): PipelineStep<CustomerPipelineItem> {
		return this.#customerPipelineStep;
	}

	get productPipelineStep(): PipelineStep<ProductPipelineItem> {
		return this.#productPipelineStep;
	}

	get invoicePipelineStep(): PipelineStep<DocumentPipelineItem> {
		return this.#invoicePipelineStep;
	}

	load(): void {
		this.#documents.reload();
	}
}

function toPrivateCustomer(customer: PrivateDocumentCustomer): Customer {
	return {
		...customer,
		type: 'private',
		group: null,
		vatZone: null,
		paymentTerms: null,
	};
}

function toBusinessCustomer(customer: BusinessDocumentCustomer): Customer {
	return {
		...customer,
		type: 'business',
		group: null,
		vatZone: null,
		paymentTerms: null,
	};
}
