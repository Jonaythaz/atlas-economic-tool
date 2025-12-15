import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreditNoteModel } from "../../models";
import { AccordionModule, CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ItemModule, SectionHeaderComponent, FlagComponent } from "@kirbydesign/designsystem";
import { CreditNote } from "../../types";

export type ComponentProps = {
    creditNote: CreditNote;
};

type ViewModel = {
    errorMessage?: string;
    creditNote: CreditNoteModel;
};

@Component({
    templateUrl: "./credit-note.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, AccordionModule, ItemModule, SectionHeaderComponent, FlagComponent]
})
export class CreditNoteModalComponent {
    readonly #creditNote = inject<ComponentProps>(COMPONENT_PROPS).creditNote;

    readonly vm: ViewModel = {
        errorMessage: this.#creditNote.state.status === 'error' ? this.#creditNote.state.errorMessage : undefined,
        creditNote: this.#creditNote.model,
    };
}
