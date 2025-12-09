import { ChangeDetectionStrategy, Component, computed, inject, linkedSignal, signal, Signal } from "@angular/core";
import { Customer, Invoice, InvoiceSegment, InvoiceState, Product } from "../../types";
import { InvoiceService } from "../../services/invoice";
import { CustomerService } from "../../services/customer";
import { ProductService } from "../../services/product";
import { InvoiceListComponent } from "../invoice-list";
import { CustomerListComponent } from "../customer-list";
import { ProductListComponent } from "../product-list";
import { ButtonComponent, SegmentedControlComponent, SegmentItem, ThemeColor, ToastController } from "@kirbydesign/designsystem";
import { INVOICE_SEGMENTS } from "../../constants";
import { fetchSettings } from "../../commands";
import { InvoiceModel } from "../../models";

type ViewModel = {
    segments: Signal<SegmentItem[]>;
    selectedSegment: Signal<SegmentItem>;
    invoices: Signal<Invoice[]>;
    customers: Signal<Customer[]>;
    products: Signal<Product[]>;
    creating: Signal<boolean>;
    selectSegment: (segment: SegmentItem) => void;
    viewInvoice: (invoice: Invoice) => Promise<void>;
    editCustomer: (customer: Customer) => Promise<void>;
    editProduct: (product: Product) => Promise<void>;
    createInvoices: () => void;
};

@Component({
    selector: "atlas-invoice-overview",
    templateUrl: "./invoice-overview.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InvoiceListComponent, CustomerListComponent, ProductListComponent, SegmentedControlComponent, ButtonComponent]
})
export class InvoiceOverviewComponent {
    readonly #invoiceService = inject(InvoiceService);
    readonly #customerService = inject(CustomerService);
    readonly #productService = inject(ProductService);
    readonly #toastController = inject(ToastController);

    readonly creating = signal(false);

    readonly #selectedSegment = signal(INVOICE_SEGMENTS[InvoiceSegment.Invoices]);
    readonly #segments = computed(() => {
        const customerItem = this.#customerService.hasErrors()
            ? { ...INVOICE_SEGMENTS[InvoiceSegment.Customers], badge: ERRORS_BADGE } 
            : INVOICE_SEGMENTS[InvoiceSegment.Customers];
        const productItem = this.#productService.hasErrors()
            ? { ...INVOICE_SEGMENTS[InvoiceSegment.Products], badge: ERRORS_BADGE } 
            : INVOICE_SEGMENTS[InvoiceSegment.Products];
        return [
            INVOICE_SEGMENTS[InvoiceSegment.Invoices],
            customerItem,
            productItem,
        ];
    });

    readonly #invoices = linkedSignal<Invoice[]>(() => this.#invoiceService.invoices().map((model) => ({ model, state: { status: 'pending' } })));

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
        this.#invoices.update((invoices) => invoices.map((invoice) => invoice.state.status !== 'created' ? { ...invoice, state: { status: 'creating' } } : invoice));
        const invoiceResults = this.#invoices()
            .filter((invoice) => invoice.state.status === 'creating')
            .map((invoice) => this.#invoiceService.createInvoice(invoice.model, customerMap, tokens, defaults)
                .then(
                    () => ({ model: invoice.model, state: { status: 'created' } satisfies InvoiceState }),
                    (error) => ({ model: invoice.model, state: { status: 'error', errorMessage: error.message } satisfies InvoiceState })
                )
                .then((invoiceResult) => this.#invoices.update((invoices) => invoices.map((i) => i.model.id === invoiceResult.model.id ? invoiceResult : i)))
            );
        await Promise.all(invoiceResults).finally(() => this.creating.set(false));
    }

    readonly vm: ViewModel = {
        segments: this.#segments,
        selectedSegment: this.#selectedSegment,
        invoices: this.#invoices,
        customers: this.#customerService.customers,
        products: this.#productService.products,
        creating: this.creating,
        selectSegment: (segment: SegmentItem) => this.#selectedSegment.set(segment),
        viewInvoice: this.#invoiceService.viewInvoice.bind(this.#invoiceService),
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