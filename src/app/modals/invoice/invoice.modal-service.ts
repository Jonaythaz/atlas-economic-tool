import { Injectable, inject } from '@angular/core';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import { ModalController } from '@kirbydesign/designsystem';

import { InvoiceModalComponent } from './invoice.modal-component';

@Injectable({ providedIn: 'root' })
export class InvoiceModalService {
	readonly #modalController = inject(ModalController);

	async open(invoice: InvoiceBookingWorkflowItem): Promise<void> {
		await this.#modalController.showModal({
			component: InvoiceModalComponent,
			componentProps: { invoice },
			size: 'full-height',
		});
	}
}
