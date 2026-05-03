import { ChangeDetectionStrategy, Component, inject, type Signal, type WritableSignal } from '@angular/core';
import { CustomerListComponent } from '@atlas/components/customer-list';
import { DocumentListComponent } from '@atlas/components/document-list';
import { ProductListComponent } from '@atlas/components/product-list';
import { OverviewService } from '@atlas/services/overview';
import { ButtonComponent, IconComponent, SegmentedControlComponent, type SegmentItem } from '@kirbydesign/designsystem';

type ViewModel = {
	segments: Signal<SegmentItem[]>;
	selectedSegmentIndex: WritableSignal<number>;
	creating: Signal<boolean>;
	createInvoices: () => void;
};

@Component({
	selector: 'atlas-document-overview',
	templateUrl: './document-overview.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		DocumentListComponent,
		CustomerListComponent,
		ProductListComponent,
		SegmentedControlComponent,
		ButtonComponent,
		IconComponent,
	],
})
export class DocumentOverviewComponent {
	readonly #overviewService = inject(OverviewService);

	readonly vm: ViewModel = {
		segments: this.#overviewService.segments,
		selectedSegmentIndex: this.#overviewService.selectedSegmentIndex,
		creating: this.#overviewService.creating,
		createInvoices: this.#overviewService.createInvoices.bind(this.#overviewService),
	};
}
