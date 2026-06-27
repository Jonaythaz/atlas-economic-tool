import { Injectable, inject } from '@angular/core';
import { ModalController } from '@kirbydesign/designsystem';

import { DirectoryReadingModalComponent } from './directory-reading.modal-component';

@Injectable({ providedIn: 'root' })
export class DirectoryReadingModalService {
	readonly #modalController = inject(ModalController);

	async open(): Promise<void> {
		await this.#modalController.showModal({
			component: DirectoryReadingModalComponent,
			size: 'large',
		});
	}
}
