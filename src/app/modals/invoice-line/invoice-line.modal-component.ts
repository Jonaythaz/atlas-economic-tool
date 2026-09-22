import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { type FieldTree, FormField } from '@angular/forms/signals';
import type { BillingLine } from '@atlas/types';
import {
	ButtonComponent,
	COMPONENT_PROPS,
	FormFieldComponent,
	InputComponent,
	Modal,
	ModalFooterComponent,
	PageModule,
} from '@kirbydesign/designsystem';

export type InvoiceLineModalComponentProps = {
	line: FieldTree<BillingLine>;
};

type ViewModel = {
	line: FieldTree<BillingLine>;
	close: () => Promise<void>;
};

@Component({
	templateUrl: './invoice-line.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, FormFieldComponent, InputComponent, FormField, ModalFooterComponent, ButtonComponent],
})
export class InvoiceLineModalComponent {
	readonly #props = inject<InvoiceLineModalComponentProps>(COMPONENT_PROPS);
	readonly #modal = inject(Modal);

	readonly vm: ViewModel = {
		line: this.#props.line,
		close: this.#modal.close.bind(this.#modal),
	};
}
