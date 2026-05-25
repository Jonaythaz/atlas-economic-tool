import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { BillingDocumentsModalComponent } from './billing-documents.modal-component';

@Injectable({ providedIn: 'root' })
export class BillingDocumentsModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: BillingDocumentsModalComponent,
			size: 'large',
		});
	}
}
