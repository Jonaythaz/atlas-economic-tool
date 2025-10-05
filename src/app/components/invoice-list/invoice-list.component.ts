import { Component, input, output, Signal } from "@angular/core";
import { Invoice } from "../../models";
import { ItemModule, ListModule } from "@kirbydesign/designsystem";

type ViewModel = {
    invoices: Signal<Invoice[]>;
    selectInvoice: (invoice: Invoice) => void;
}

@Component({
    selector: 'atlas-invoice-list',
    templateUrl: './invoice-list.component.html',
    imports: [ListModule, ItemModule]
})
export class InvoiceListComponent {
    readonly invoices = input.required<Invoice[]>();
    readonly invoiceSelected = output<Invoice>();

    readonly vm: ViewModel = {
        invoices: this.invoices,
        selectInvoice: this.invoiceSelected.emit.bind(this.invoiceSelected),
    };
}  