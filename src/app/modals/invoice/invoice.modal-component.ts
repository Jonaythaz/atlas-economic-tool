import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { InvoiceModel } from "../../models";
import { AccordionModule, CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ItemModule, SectionHeaderComponent, FlagComponent } from "@kirbydesign/designsystem";
import { Invoice } from "../../types";

export type ComponentProps = {
    invoice: Invoice;
};

type ViewModel = {
    errorMessage?: string;
    invoice: InvoiceModel;
};

@Component({
    templateUrl: "./invoice.modal-component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, CardModule, FormFieldModule, AccordionModule, ItemModule, SectionHeaderComponent, FlagComponent]
})
export class InvoiceModalComponent {
    readonly #invoice = inject<ComponentProps>(COMPONENT_PROPS).invoice;

    readonly vm: ViewModel = {
        errorMessage: this.#invoice.state.status === 'error' ? this.#invoice.state.errorMessage : undefined,
        invoice: this.#invoice.model,
    };
}
