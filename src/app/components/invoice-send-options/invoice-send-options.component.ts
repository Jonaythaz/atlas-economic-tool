import { Component, computed, input, model, output, type Signal, type WritableSignal } from '@angular/core';
import type { WorkflowState } from '@atlas/types';
import {
	ButtonComponent,
	CheckboxComponent,
	FlagComponent,
	IconComponent,
	ItemComponent,
	LabelComponent,
	RadioComponent,
	RadioGroupComponent,
	SectionHeaderComponent,
} from '@kirbydesign/designsystem';
import { CardComponent } from '@kirbydesign/designsystem/card';

type ViewModel = {
	draft: WritableSignal<boolean>;
	send: WritableSignal<boolean>;
	state: Signal<WorkflowState>;
	errorMessage: Signal<string | undefined>;
	canSubmit: Signal<boolean>;
	selectDraft: () => void;
	selectBook: () => void;
	submit: () => void;
	cancel: () => void;
};

@Component({
	selector: 'atlas-invoice-send-options',
	templateUrl: './invoice-send-options.component.html',
	imports: [
		CardComponent,
		SectionHeaderComponent,
		RadioGroupComponent,
		ItemComponent,
		RadioComponent,
		LabelComponent,
		CheckboxComponent,
		FlagComponent,
		ButtonComponent,
		IconComponent,
	],
})
export class InvoiceSendOptionsComponent {
	readonly draft = model.required<boolean>();
	readonly send = model.required<boolean>();
	readonly state = input.required<WorkflowState>();
	readonly errorMessage = input<string | undefined>();
	readonly submitted = output<void>();
	readonly cancelled = output<void>();

	readonly vm: ViewModel = {
		draft: this.draft,
		send: this.send,
		state: this.state,
		errorMessage: this.errorMessage,
		canSubmit: computed(() => this.state() !== 'running' && this.state() !== 'completed'),
		selectDraft: this.draft.set.bind(this.draft, true),
		selectBook: this.draft.set.bind(this.draft, false),
		submit: this.submitted.emit.bind(this.submitted),
		cancel: this.cancelled.emit.bind(this.cancelled),
	};
}
