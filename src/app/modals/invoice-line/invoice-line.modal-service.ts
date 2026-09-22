import { Injectable, inject } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import type { BillingLine } from '@atlas/types';
import { type ModalConfig, ModalController } from '@kirbydesign/designsystem';

import { InvoiceLineModalComponent, type InvoiceLineModalComponentProps } from './invoice-line.modal-component';

@Injectable({ providedIn: 'root' })
export class InvoiceLineModalService {
	readonly #modalController = inject(ModalController);

	async open(line: FieldTree<BillingLine>): Promise<void> {
		await this.#modalController.showModal(createConfig({ line }));
	}
}

function createConfig(componentProps: InvoiceLineModalComponentProps): ModalConfig {
	return {
		component: InvoiceLineModalComponent,
		componentProps,
		size: 'large',
	};
}
