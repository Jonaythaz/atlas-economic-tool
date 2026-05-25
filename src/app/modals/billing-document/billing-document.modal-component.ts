import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import type { BillingDocument } from '@atlas/types';
import type { BillingDocumentWorkflowItem } from '@atlas/workflow-items/billing-document';
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
	document: BillingDocumentWorkflowItem;
};

type ViewModel = {
	errorMessage: Signal<string | undefined>;
	document: Signal<BillingDocument>;
};

@Component({
	templateUrl: './billing-document.modal-component.html',
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
export class BillingDocumentModalComponent {
	readonly #document = inject<ComponentProps>(COMPONENT_PROPS).document;

	readonly vm: ViewModel = {
		errorMessage: this.#document.errorMessage,
		document: this.#document.value,
	};
}
