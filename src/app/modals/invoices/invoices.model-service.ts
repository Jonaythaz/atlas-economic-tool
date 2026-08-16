import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { InvoicesModalComponent } from './invoices.modal-component';

@Injectable({ providedIn: 'root' })
export class InvoicesModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: InvoicesModalComponent,
			size: 'large',
		});
	}
}
