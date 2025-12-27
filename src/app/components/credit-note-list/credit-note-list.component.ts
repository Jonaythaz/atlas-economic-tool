import { ChangeDetectionStrategy, Component, input, output, Signal } from "@angular/core";
import { ItemModule, ListModule, SectionHeaderComponent } from "@kirbydesign/designsystem";
import { CreditNoteResource } from "../../types";
import { StatusIndicatorComponent } from "../status-indicator/status-indicator.component";

type ViewModel = {
    creditNotes: Signal<CreditNoteResource[]>;
    selectCreditNote: (creditNote: CreditNoteResource) => void;
}

@Component({
    selector: 'atlas-credit-note-list',
    templateUrl: './credit-note-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListModule, ItemModule, SectionHeaderComponent, StatusIndicatorComponent]
})
export class CreditNoteListComponent {
    readonly creditNotes = input.required<CreditNoteResource[]>();
    readonly creditNoteSelected = output<CreditNoteResource>();

    readonly vm: ViewModel = {
        creditNotes: this.creditNotes,
        selectCreditNote: this.creditNoteSelected.emit.bind(this.creditNoteSelected),
    };
}  