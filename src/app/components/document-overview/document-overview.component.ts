import { ChangeDetectionStrategy, Component, inject, Signal } from "@angular/core";
import { CustomerResource, InvoiceResource, ProductResource, CreditNoteResource } from "../../types";
import { InvoiceService } from "../../services/invoice";
import { CustomerService } from "../../services/customer";
import { ProductService } from "../../services/product";
import { InvoiceListComponent } from "../invoice-list";
import { CustomerListComponent } from "../customer-list";
import { ProductListComponent } from "../product-list";
import { ButtonComponent, SegmentedControlComponent, SegmentItem, IconComponent } from "@kirbydesign/designsystem";
import { CreditNoteService } from "../../services/credit-note";
import { CreditNoteListComponent } from "../credit-note-list";
import { OverviewService } from "../../services/overview";
import { CustomerModalService } from "../../modals/customer";
import { ProductModalService } from "../../modals/product";

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
    imports: [InvoiceListComponent, CustomerListComponent, ProductListComponent, SegmentedControlComponent, ButtonComponent, CreditNoteListComponent, IconComponent]
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
