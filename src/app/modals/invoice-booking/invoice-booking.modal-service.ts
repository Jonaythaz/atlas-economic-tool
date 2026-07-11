import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { InvoiceBookingModalComponent } from './invoice-booking.modal-component';

@Injectable({ providedIn: 'root' })
export class InvoiceBookingModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: InvoiceBookingModalComponent,
			size: 'large',
		});
	}
}
