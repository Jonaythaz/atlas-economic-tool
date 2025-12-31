import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import type { InvoiceModel } from "@atlas/models";
import type { InvoiceResource } from "@atlas/types";
import {
	AccordionModule,
	CardModule,
	COMPONENT_PROPS,
	FlagComponent,
	FormFieldModule,
	ItemModule,
	PageModule,
	SectionHeaderComponent,
} from "@kirbydesign/designsystem";

export type ComponentProps = {
	invoice: InvoiceResource;
};

type ViewModel = {
	errorMessage?: string;
	invoice: InvoiceModel;
};

@Component({
	templateUrl: "./invoice.modal-component.html",
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
export class InvoiceModalComponent {
	readonly #invoice = inject<ComponentProps>(COMPONENT_PROPS).invoice;

	readonly vm: ViewModel = {
		errorMessage: this.#invoice.status === "error" ? this.#invoice.message : undefined,
		invoice: this.#invoice.model,
	};
}
