import { ChangeDetectionStrategy, Component, inject, type Resource } from '@angular/core';
import { StatusIndicatorComponent } from '@atlas/components/status-indicator';
import { DocumentModalService } from '@atlas/modals/document';
import { DocumentService } from '@atlas/services/document';
import type { DocumentPipelineItem } from '@atlas/utils/document-pipeline-item';
import {
	ItemComponent,
	LabelComponent,
	ListComponent,
	ListItemTemplateDirective,
	ListSectionHeaderComponent,
	ListSectionHeaderDirective,
} from '@kirbydesign/designsystem';

type ViewModel = {
	documents: Resource<DocumentPipelineItem[] | undefined>;
	getSectionName: (document: DocumentPipelineItem) => string;
	selectDocument: (document: DocumentPipelineItem) => Promise<void>;
};

@Component({
	selector: 'atlas-document-list',
	templateUrl: './document-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		ListComponent,
		ListSectionHeaderComponent,
		ItemComponent,
		LabelComponent,
		StatusIndicatorComponent,
		ListSectionHeaderDirective,
		ListItemTemplateDirective,
	],
})
export class DocumentListComponent {
	readonly #pipelineStep = inject(DocumentService).invoicePipelineStep;
	readonly #modalService = inject(DocumentModalService);

	readonly vm: ViewModel = {
		documents: this.#pipelineStep.items,
		getSectionName: (item) => (item.input().type === 'invoice' ? 'Invoices' : 'Credit Notes'),
		selectDocument: this.#modalService.open.bind(this.#modalService),
	};
}
