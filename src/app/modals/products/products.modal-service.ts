import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { ProductsModalComponent } from './products.modal-component';

@Injectable({ providedIn: 'root' })
export class ProductsModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: ProductsModalComponent,
			size: 'large',
		});
	}
}
