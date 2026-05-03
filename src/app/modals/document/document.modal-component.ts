import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import type { Document } from '@atlas/types';
import type { DocumentPipelineItem } from '@atlas/utils/document-pipeline-item';
import {
	AccordionModule,
	CardModule,
	COMPONENT_PROPS,
	FlagComponent,
	FormFieldModule,
	ItemModule,
	PageModule,
	SectionHeaderComponent,
} from '@kirbydesign/designsystem';

export type ComponentProps = {
	document: DocumentPipelineItem;
};

type ViewModel = {
	errorMessage?: string;
	document: Document;
};

@Component({
	templateUrl: './document.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		CardModule,
		FormFieldModule,
		AccordionModule,
		ItemModule,
		SectionHeaderComponent,
		FlagComponent,
	],
})
export class DocumentModalComponent {
	readonly #document = inject<ComponentProps>(COMPONENT_PROPS).document;

	readonly vm: ViewModel = {
		errorMessage: this.#document.error()?.message,
		document: this.#document.input(),
	};
}
