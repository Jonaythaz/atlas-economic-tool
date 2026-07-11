import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import type { InvoiceBookingModel } from '@atlas/models';
import { InvoiceBookingService } from '@atlas/services/invoice-booking';
import type { InvoiceBookingWorkflowItem } from '@atlas/workflow-items/invoice-booking';
import {
	ButtonComponent,
	CardComponent,
	COMPONENT_PROPS,
	FlagComponent,
	ItemComponent,
	ModalFooterComponent,
	PageTitleComponent,
} from '@kirbydesign/designsystem';

export type ComponentProps = {
	invoice: InvoiceBookingWorkflowItem;
};

type ViewModel = {
	errorMessage: Signal<string | undefined>;
	invoice: Signal<InvoiceBookingModel>;
	book: () => Promise<void>;
};

@Component({
	templateUrl: './invoice.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [FlagComponent, CardComponent, ItemComponent, ModalFooterComponent, ButtonComponent, PageTitleComponent],
})
export class InvoiceModalComponent {
	readonly #invoice = inject<ComponentProps>(COMPONENT_PROPS).invoice;
	readonly #invoiceBookingService = inject(InvoiceBookingService);

	async #book(): Promise<void> {
		await this.#invoiceBookingService.bookInvoice(this.#invoice);
	}

	readonly vm: ViewModel = {
		errorMessage: this.#invoice.errorMessage,
		invoice: this.#invoice.value,
		book: this.#book.bind(this),
	};
}
