import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import type { ProductWorkflowItem } from '@atlas/workflow-items/product';
import { ItemComponent, LabelComponent, ListComponent, ListItemTemplateDirective } from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator';

@Component({
	selector: 'atlas-product-list',
	templateUrl: './product-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListComponent, ItemComponent, LabelComponent, WorkflowStateIndicatorComponent, ListItemTemplateDirective],
})
export class ProductListComponent {
	readonly products = input.required<ProductWorkflowItem[]>();
	readonly selected = output<ProductWorkflowItem>();
}
