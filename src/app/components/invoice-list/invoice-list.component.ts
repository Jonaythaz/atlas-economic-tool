import { ChangeDetectionStrategy, Component, input, output, Signal } from "@angular/core";
import { ItemModule, ListModule, SpinnerComponent, IconComponent, SectionHeaderComponent } from "@kirbydesign/designsystem";
import { Invoice } from "../../types";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";

type ViewModel = {
    invoices: Signal<Invoice[]>;
    selectInvoice: (invoice: Invoice) => void;
}

@Component({
    selector: 'atlas-invoice-list',
    templateUrl: './invoice-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListModule, ItemModule, SpinnerComponent, BadgeComponent, IconComponent, SectionHeaderComponent]
})
export class InvoiceListComponent {
    readonly invoices = input.required<Invoice[]>();
    readonly invoiceSelected = output<Invoice>();

    readonly vm: ViewModel = {
        invoices: this.invoices,
        selectInvoice: this.invoiceSelected.emit.bind(this.invoiceSelected),
    };
}  