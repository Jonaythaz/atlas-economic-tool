import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { CustomersModalComponent } from './customers.modal-component';

@Injectable({ providedIn: 'root' })
export class CustomersModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: CustomersModalComponent,
			size: 'large',
		});
	}
}
