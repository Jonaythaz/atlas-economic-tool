import { Injectable, inject } from '@angular/core';
import type { DocumentPipelineItem } from '@atlas/utils/document-pipeline-item';
import { ModalController } from '@kirbydesign/designsystem';

import { DocumentModalComponent } from './document.modal-component';

@Injectable({ providedIn: 'root' })
export class DocumentModalService {
	readonly #modalController = inject(ModalController);

	async open(document: DocumentPipelineItem): Promise<void> {
		await this.#modalController.showModal({
			component: DocumentModalComponent,
			componentProps: { document },
			size: 'full-height',
		});
	}
}
