import { ChangeDetectionStrategy, Component, inject, type Resource } from '@angular/core';
import { StatusIndicatorComponent } from '@atlas/components/status-indicator';
import { ProductModalService } from '@atlas/modals/product';
import { DocumentService } from '@atlas/services/document';
import type { ProductPipelineItem } from '@atlas/utils/product-pipeline-item';
import { ItemComponent, LabelComponent, ListComponent, ListItemTemplateDirective } from '@kirbydesign/designsystem';

type ViewModel = {
	products: Resource<ProductPipelineItem[] | undefined>;
	selectProduct: (product: ProductPipelineItem) => Promise<void>;
};

@Component({
	selector: 'atlas-product-list',
	templateUrl: './product-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListComponent, ItemComponent, LabelComponent, StatusIndicatorComponent, ListItemTemplateDirective],
})
export class ProductListComponent {
	readonly #pipelineStep = inject(DocumentService).productPipelineStep;
	readonly #modalService = inject(ProductModalService);

	readonly vm: ViewModel = {
		products: this.#pipelineStep.items,
		selectProduct: this.#modalService.open.bind(this.#modalService),
	};
}
