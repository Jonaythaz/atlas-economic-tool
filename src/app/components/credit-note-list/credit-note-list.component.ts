import { ChangeDetectionStrategy, Component, input, output, Signal } from "@angular/core";
import { ItemModule, ListModule, SpinnerComponent, IconComponent, SectionHeaderComponent } from "@kirbydesign/designsystem";
import { CreditNote } from "../../types";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";

type ViewModel = {
    creditNotes: Signal<CreditNote[]>;
    selectCreditNote: (creditNote: CreditNote) => void;
}

@Component({
    selector: 'atlas-credit-note-list',
    templateUrl: './credit-note-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListModule, ItemModule, SpinnerComponent, BadgeComponent, IconComponent, SectionHeaderComponent]
})
export class CreditNoteListComponent {
    readonly creditNotes = input.required<CreditNote[]>();
    readonly creditNoteSelected = output<CreditNote>();

    readonly vm: ViewModel = {
        creditNotes: this.creditNotes,
        selectCreditNote: this.creditNoteSelected.emit.bind(this.creditNoteSelected),
    };
}  