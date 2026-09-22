import { Component, inject, input, type Signal } from '@angular/core';
import { type FieldTree, FormField } from '@angular/forms/signals';
import { InvoiceLineModalService } from '@atlas/modals/invoice-line';
import type { BillingDocument, BillingLine, BillingRecipient } from '@atlas/types';
import {
	ButtonComponent,
	CardComponent,
	FormFieldComponent,
	IconComponent,
	InputComponent,
	SectionHeaderComponent,
} from '@kirbydesign/designsystem';

type ViewModel = {
	invoice: Signal<FieldTree<BillingDocument>>;
	editLine: (line: FieldTree<BillingLine>) => Promise<void>;
	recipientField: (recipient: FieldTree<BillingRecipient>, field: 'ean' | 'email') => FieldTree<string>;
};

@Component({
	selector: 'atlas-invoice-form',
	templateUrl: './invoice-form.component.html',
	imports: [
		CardComponent,
		SectionHeaderComponent,
		InputComponent,
		FormFieldComponent,
		FormField,
		ButtonComponent,
		IconComponent,
	],
})
export class InvoiceFormComponent {
	readonly form = input.required<FieldTree<BillingDocument>>();

	recipientField(recipient: FieldTree<BillingRecipient>, field: 'ean' | 'email'): FieldTree<string> {
		return (recipient as FieldTree<BillingRecipient> & Record<'ean' | 'email', FieldTree<string>>)[field];
	}

	readonly #lineModalService = inject(InvoiceLineModalService);

	readonly vm: ViewModel = {
		invoice: this.form,
		editLine: this.#lineModalService.open.bind(this.#lineModalService),
		recipientField: this.recipientField.bind(this),
	};
}
