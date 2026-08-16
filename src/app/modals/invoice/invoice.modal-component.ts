import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import type { BillingDocument } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import {
	AccordionModule,
	ButtonComponent,
	CardComponent,
	COMPONENT_PROPS,
	FlagComponent,
	ItemComponent,
	ModalFooterComponent,
	PageTitleComponent,
	SectionHeaderComponent,
} from '@kirbydesign/designsystem';

export type InvoiceComponentProps = {
	invoice: InvoiceWorkflowItem;
};

type ViewModel = {
	errorMessage: Signal<string | undefined>;
	document: Signal<BillingDocument>;
};

@Component({
	templateUrl: './invoice.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		FlagComponent,
		CardComponent,
		ItemComponent,
		ModalFooterComponent,
		ButtonComponent,
		PageTitleComponent,
		AccordionModule,
		SectionHeaderComponent,
	],
})
export class InvoiceModalComponent {
	readonly #invoice = inject<InvoiceComponentProps>(COMPONENT_PROPS).invoice;

	readonly vm: ViewModel = {
		errorMessage: this.#invoice.errorMessage,
		document: this.#invoice.value,
	};
}
