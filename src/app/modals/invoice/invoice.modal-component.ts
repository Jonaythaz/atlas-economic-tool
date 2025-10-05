import { Component, inject } from "@angular/core";
import { Invoice } from "../../models";
import { AccordionModule, CardModule, COMPONENT_PROPS, FormFieldModule, PageModule, ItemModule, SectionHeaderComponent } from "@kirbydesign/designsystem";

export type ComponentProps = {
    invoice: Invoice;
};

type ViewModel = {
    invoice: Invoice;
};

@Component({
    templateUrl: "./invoice.modal-component.html",
    imports: [PageModule, CardModule, FormFieldModule, AccordionModule, ItemModule, SectionHeaderComponent]
})
export class InvoiceModalComponent {
    readonly #invoice = inject<ComponentProps>(COMPONENT_PROPS).invoice;

    readonly vm: ViewModel = {
        invoice: this.#invoice,
    };
}
