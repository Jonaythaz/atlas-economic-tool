import { Injectable, inject } from '@angular/core';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import { type ModalConfig, ModalController } from '@kirbydesign/designsystem';

import { type InvoiceComponentProps, InvoiceModalComponent } from './invoice.modal-component';

@Injectable({ providedIn: 'root' })
export class InvoiceModalService {
	readonly #modalController = inject(ModalController);

	async open(invoice: InvoiceWorkflowItem): Promise<void> {
		await this.#modalController.showModal(createConfig({ invoice }));
	}
}

function createConfig(componentProps: InvoiceComponentProps): ModalConfig {
	return {
		component: InvoiceModalComponent,
		componentProps,
		size: 'full-height',
	};
}
