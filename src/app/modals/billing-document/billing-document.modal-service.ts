import { Injectable, inject } from '@angular/core';
import type { BillingDocumentWorkflowItem } from '@atlas/workflow-items/billing-document';
import { ModalController } from '@kirbydesign/designsystem';

import { BillingDocumentModalComponent } from './billing-document.modal-component';

@Injectable({ providedIn: 'root' })
export class BillingDocumentModalService {
	readonly #modalController = inject(ModalController);

	async open(document: BillingDocumentWorkflowItem): Promise<void> {
		await this.#modalController.showModal({
			component: BillingDocumentModalComponent,
			componentProps: { document },
			size: 'full-height',
		});
	}
}
