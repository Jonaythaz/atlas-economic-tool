import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { CreditNoteModel } from "../../models";
import { AccordionModule, CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ItemModule, SectionHeaderComponent, FlagComponent } from "@kirbydesign/designsystem";
import { CreditNoteResource } from "../../types";

export type ComponentProps = {
    creditNote: CreditNoteResource;
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
        errorMessage: this.#creditNote.status === 'error' ? this.#creditNote.message : undefined,
        creditNote: this.#creditNote.model,
    };
}
