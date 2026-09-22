import { Component, inject, input, type Signal, signal, type WritableSignal } from '@angular/core';
import type { FieldTree } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { InvoiceFormComponent } from '@atlas/components/invoice-form';
import { InvoiceSendOptionsComponent } from '@atlas/components/invoice-send-options';
import { invoiceForm } from '@atlas/forms/invoice';
import type { Settings } from '@atlas/models';
import type { BillingDocument } from '@atlas/types';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import { HeaderComponent, PageModule } from '@kirbydesign/designsystem';

type ViewModel = {
	form: FieldTree<BillingDocument>;
	draft: WritableSignal<boolean>;
	send: WritableSignal<boolean>;
	state: Signal<InvoiceWorkflowItem>;
	submit: () => Promise<void>;
	cancel: () => Promise<boolean>;
};

@Component({
	templateUrl: './invoice.page-component.html',
	imports: [PageModule, HeaderComponent, InvoiceFormComponent, InvoiceSendOptionsComponent],
})
export class InvoicePageComponent {
	readonly invoice = input.required<InvoiceWorkflowItem>();
	readonly settings = input.required<Settings>();

	readonly #router = inject(Router);

	readonly #form = invoiceForm(this.invoice);
	readonly #draft = signal(false);
	readonly #send = signal(true);

	async #submit(): Promise<void> {
		const invoice = this.invoice();
		const settings = this.settings();
		const action = this.#draft() ? 'draft' : this.#send() ? 'send' : 'book';

		invoice.action.set(action);
		invoice.update(this.#form().value());
		await invoice.create(settings);
	}

	async #cancel(): Promise<boolean> {
		return this.#router.navigate(['/']);
	}

	readonly vm: ViewModel = {
		form: this.#form,
		draft: this.#draft,
		send: this.#send,
		state: this.invoice,
		submit: this.#submit.bind(this),
		cancel: this.#cancel.bind(this),
	};
}
