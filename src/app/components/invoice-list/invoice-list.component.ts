import { ChangeDetectionStrategy, Component, input, output, type Signal } from "@angular/core";
import { ItemModule, ListModule, SectionHeaderComponent } from "@kirbydesign/designsystem";
import type { InvoiceResource } from "../../types";
import { StatusIndicatorComponent } from "../status-indicator";

type ViewModel = {
	invoices: Signal<InvoiceResource[]>;
	selectInvoice: (invoice: InvoiceResource) => void;
};

@Component({
	selector: "atlas-invoice-list",
	templateUrl: "./invoice-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListModule, ItemModule, SectionHeaderComponent, StatusIndicatorComponent],
})
export class InvoiceListComponent {
	readonly invoices = input.required<InvoiceResource[]>();
	readonly invoiceSelected = output<InvoiceResource>();

	readonly vm: ViewModel = {
		invoices: this.invoices,
		selectInvoice: this.invoiceSelected.emit.bind(this.invoiceSelected),
	};
}
