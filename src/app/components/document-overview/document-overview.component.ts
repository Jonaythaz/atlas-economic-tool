import { ChangeDetectionStrategy, Component, inject, type Signal } from "@angular/core";
import { CreditNoteListComponent } from "@atlas/components/credit-note-list";
import { CustomerListComponent } from "@atlas/components/customer-list";
import { InvoiceListComponent } from "@atlas/components/invoice-list";
import { ProductListComponent } from "@atlas/components/product-list";
import { CustomerModalService } from "@atlas/modals/customer";
import { ProductModalService } from "@atlas/modals/product";
import { CreditNoteService } from "@atlas/services/credit-note";
import { CustomerService } from "@atlas/services/customer";
import { InvoiceService } from "@atlas/services/invoice";
import { OverviewService } from "@atlas/services/overview";
import { ProductService } from "@atlas/services/product";
import type { CreditNoteResource, CustomerResource, InvoiceResource, ProductResource } from "@atlas/types";
import { ButtonComponent, IconComponent, SegmentedControlComponent, type SegmentItem } from "@kirbydesign/designsystem";

type ViewModel = {
	segments: Signal<SegmentItem[]>;
	selectedSegment: Signal<SegmentItem>;
	invoices: Signal<InvoiceResource[]>;
	creditNotes: Signal<CreditNoteResource[]>;
	customers: Signal<CustomerResource[]>;
	products: Signal<ProductResource[]>;
	creating: Signal<boolean>;
	selectSegment: (segment: SegmentItem) => void;
	viewInvoice: (invoice: InvoiceResource) => Promise<void>;
	viewCreditNote: (creditNote: CreditNoteResource) => Promise<void>;
	editCustomer: (customer: CustomerResource) => Promise<void>;
	editProduct: (product: ProductResource) => Promise<void>;
	createInvoices: () => void;
};

@Component({
	selector: "atlas-document-overview",
	templateUrl: "./document-overview.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		InvoiceListComponent,
		CustomerListComponent,
		ProductListComponent,
		SegmentedControlComponent,
		ButtonComponent,
		CreditNoteListComponent,
		IconComponent,
	],
})
export class DocumentOverviewComponent {
	readonly #overviewService = inject(OverviewService);
	readonly #invoiceService = inject(InvoiceService);
	readonly #creditNoteService = inject(CreditNoteService);
	readonly #customerService = inject(CustomerService);
	readonly #productService = inject(ProductService);
	readonly #customerModalService = inject(CustomerModalService);
	readonly #productModalService = inject(ProductModalService);

	readonly vm: ViewModel = {
		segments: this.#overviewService.segments,
		selectedSegment: this.#overviewService.selectedSegment,
		invoices: this.#invoiceService.invoices,
		creditNotes: this.#creditNoteService.creditNotes,
		customers: this.#customerService.customers,
		products: this.#productService.products,
		creating: this.#overviewService.creating,
		selectSegment: this.#overviewService.setSelectedSegment.bind(this.#overviewService),
		viewInvoice: this.#invoiceService.viewInvoice.bind(this.#invoiceService),
		viewCreditNote: this.#creditNoteService.viewCreditNote.bind(this.#creditNoteService),
		editCustomer: this.#customerModalService.open.bind(this.#customerModalService),
		editProduct: this.#productModalService.open.bind(this.#productModalService),
		createInvoices: this.#overviewService.createInvoices.bind(this),
	};
}
