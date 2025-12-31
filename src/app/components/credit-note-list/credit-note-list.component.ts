import { ChangeDetectionStrategy, Component, input, output, type Signal } from "@angular/core";
import { StatusIndicatorComponent } from "@atlas/components/status-indicator";
import type { CreditNoteResource } from "@atlas/types";
import { ItemModule, ListModule, SectionHeaderComponent } from "@kirbydesign/designsystem";

type ViewModel = {
	creditNotes: Signal<CreditNoteResource[]>;
	selectCreditNote: (creditNote: CreditNoteResource) => void;
};

@Component({
	selector: "atlas-credit-note-list",
	templateUrl: "./credit-note-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListModule, ItemModule, SectionHeaderComponent, StatusIndicatorComponent],
})
export class CreditNoteListComponent {
	readonly creditNotes = input.required<CreditNoteResource[]>();
	readonly creditNoteSelected = output<CreditNoteResource>();

	readonly vm: ViewModel = {
		creditNotes: this.creditNotes,
		selectCreditNote: this.creditNoteSelected.emit.bind(this.creditNoteSelected),
	};
}
