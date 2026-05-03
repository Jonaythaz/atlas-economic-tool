import { Injectable, inject } from '@angular/core';
import { fetchSettings } from '@atlas/commands';
import type { ProductPipelineItem } from '@atlas/utils/product-pipeline-item';
import { type ModalConfig, ModalController } from '@kirbydesign/designsystem';

import { type ComponentProps, ProductModalComponent } from './product.modal-component';

@Injectable({ providedIn: 'root' })
export class ProductModalService {
	readonly #modalController = inject(ModalController);

	async open(product: ProductPipelineItem): Promise<void> {
		const settings = await fetchSettings();
		const config = createConfig({ product, settings });
		await this.#modalController.showModal(config);
	}
}

function createConfig(componentProps: ComponentProps): ModalConfig {
	return {
		component: ProductModalComponent,
		size: 'full-height',
		componentProps,
	};
}
