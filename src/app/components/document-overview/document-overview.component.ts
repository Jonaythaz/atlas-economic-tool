import { ChangeDetectionStrategy, Component, computed, inject, signal, Signal } from "@angular/core";
import { Customer, Invoice, OverviewSegment, Product, CreditNote } from "../../types";
import { InvoiceService } from "../../services/invoice";
import { CustomerService } from "../../services/customer";
import { ProductService } from "../../services/product";
import { InvoiceListComponent } from "../invoice-list";
import { CustomerListComponent } from "../customer-list";
import { ProductListComponent } from "../product-list";
import { ButtonComponent, SegmentedControlComponent, SegmentItem, ThemeColor, ToastController } from "@kirbydesign/designsystem";
import { OVERVIEW_SEGMENTS } from "../../constants";
import { fetchSettings } from "../../commands";
import { CreditNoteService } from "../../services/credit-note";
import { CreditNoteListComponent } from "../credit-note-list";

type ViewModel = {
    segments: Signal<SegmentItem[]>;
    selectedSegment: Signal<SegmentItem>;
    invoices: Signal<Invoice[]>;
    creditNotes: Signal<CreditNote[]>;
    customers: Signal<Customer[]>;
    products: Signal<Product[]>;
    creating: Signal<boolean>;
    selectSegment: (segment: SegmentItem) => void;
    viewInvoice: (invoice: Invoice) => Promise<void>;
    viewCreditNote: (creditNote: CreditNote) => Promise<void>;
    editCustomer: (customer: Customer) => Promise<void>;
    editProduct: (product: Product) => Promise<void>;
    createInvoices: () => void;
};

@Component({
    selector: "atlas-document-overview",
    templateUrl: "./document-overview.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InvoiceListComponent, CustomerListComponent, ProductListComponent, SegmentedControlComponent, ButtonComponent, CreditNoteListComponent]
})
export class DocumentOverviewComponent {
    readonly #invoiceService = inject(InvoiceService);
    readonly #creditNoteService = inject(CreditNoteService);
    readonly #customerService = inject(CustomerService);
    readonly #productService = inject(ProductService);
    readonly #toastController = inject(ToastController);

    readonly creating = signal(false);

    readonly #selectedSegment = signal(OVERVIEW_SEGMENTS[OverviewSegment.Documents]);
    readonly #segments = computed(() => {
        const customerItem = this.#customerService.hasErrors()
            ? { ...OVERVIEW_SEGMENTS[OverviewSegment.Customers], badge: ERRORS_BADGE } 
            : OVERVIEW_SEGMENTS[OverviewSegment.Customers];
        const productItem = this.#productService.hasErrors()
            ? { ...OVERVIEW_SEGMENTS[OverviewSegment.Products], badge: ERRORS_BADGE } 
            : OVERVIEW_SEGMENTS[OverviewSegment.Products];
        return [
            OVERVIEW_SEGMENTS[OverviewSegment.Documents],
            customerItem,
            productItem,
        ];
    });

    async #createInvoices(): Promise<void> {
        this.creating.set(true);
        const { tokens, defaults } = await fetchSettings();
        const hasErrors = await Promise.all([
            this.#customerService.createCustomers(tokens, defaults).then((customers) => customers.some((customer) => customer.state.status === 'error')),
            this.#productService.createProducts(tokens, defaults).then((products) => products.some((product) => product.state.status === 'error'))
        ]).then(([customerErrors, productErrors]) => customerErrors || productErrors);
        if (hasErrors) {
            this.#toastController.showToast({ message: 'One or more errors occured while creating customers and products', messageType: 'warning' });
            this.creating.set(false);
            return;
        }
        const customerMap = this.#customerService.customers().reduce((map, customer) => {
            if (customer.state.status === 'created') {
                map.set(customer.id, customer.state.externalId);
            }
            return map;
        }, new Map<string, number>());
        const invoicesPromise = this.#invoiceService.createInvoices(customerMap, tokens, defaults);
        const creditNotesPromise = this.#creditNoteService.createCreditNotes(customerMap, tokens, defaults);
        await Promise.all([invoicesPromise, creditNotesPromise]).finally(() => this.creating.set(false));
    }

    readonly vm: ViewModel = {
        segments: this.#segments,
        selectedSegment: this.#selectedSegment,
        invoices: this.#invoiceService.invoices,
        creditNotes: this.#creditNoteService.creditNotes,
        customers: this.#customerService.customers,
        products: this.#productService.products,
        creating: this.creating,
        selectSegment: (segment: SegmentItem) => this.#selectedSegment.set(segment),
        viewInvoice: this.#invoiceService.viewInvoice.bind(this.#invoiceService),
        viewCreditNote: this.#creditNoteService.viewCreditNote.bind(this.#creditNoteService),
        editCustomer: this.#customerService.editCustomer.bind(this.#customerService),
        editProduct: this.#productService.editProduct.bind(this.#productService),
        createInvoices: this.#createInvoices.bind(this),
    };
}

type SegmentItemBadge = {
    content?: string;
    icon?: string;
    description?: string;
    themeColor: ThemeColor;
};
const ERRORS_BADGE: SegmentItemBadge = { icon: 'warning', description: 'Errors present', themeColor: 'danger' };