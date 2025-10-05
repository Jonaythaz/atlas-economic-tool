import { Component, inject, Signal, signal } from "@angular/core";
import { HeaderModule, PageModule, LoadingOverlayComponent, ButtonComponent, ActionGroupComponent, IconModule } from "@kirbydesign/designsystem";
import { loadInvoices } from "../../commands/load-invoices.command";
import { Invoice } from "../../models";
import { InvoiceListComponent } from "../../components/invoice-list";
import { InvoiceModalService } from "../../modals/invoice/invoice.modal-service";

type ViewModel = {
    invoices: Signal<Invoice[] | null>;
    invoiceError: Signal<string | null>;
    isLoading: Signal<boolean>;
    loadInvoices: () => Promise<void>;
    viewInvoice: (invoice: Invoice) => Promise<void>;
}

@Component({
    selector: "atlas-home",
    templateUrl: "./home.component.html",
    imports: [PageModule, HeaderModule, ActionGroupComponent, IconModule, LoadingOverlayComponent, InvoiceListComponent, ButtonComponent]
})
export class HomeComponent {
    readonly #invoiceModalService = inject(InvoiceModalService);

    readonly #invoices = signal<Invoice[] | null>(null);
    readonly #invoiceError = signal<string | null>(null);
    readonly #isLoading = signal(false);

    async #loadInvoices(): Promise<void> {
        this.#isLoading.set(true);
        await loadInvoices().then(
            (invoices) => {
                this.#invoices.set(invoices);
                this.#invoiceError.set(null);
                this.#isLoading.set(false);
            },
            (err) => {
                this.#invoiceError.set(err);
                this.#invoices.set(null);
                this.#isLoading.set(false);
            }
        );
    }

    readonly vm: ViewModel = {
        invoices: this.#invoices.asReadonly(),
        invoiceError: this.#invoiceError.asReadonly(),
        isLoading: this.#isLoading.asReadonly(),
        loadInvoices: this.#loadInvoices.bind(this),
        viewInvoice: this.#invoiceModalService.openInvoiceModal.bind(this.#invoiceModalService),
    };
}