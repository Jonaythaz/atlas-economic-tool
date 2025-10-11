import { Component, computed, inject, resource, Signal } from "@angular/core";
import { HeaderModule, PageModule, LoadingOverlayComponent, ButtonComponent, ActionGroupComponent, IconModule, EmptyStateModule } from "@kirbydesign/designsystem";
import { loadInvoices } from "../../commands";
import { Invoice } from "../../models";
import { InvoiceListComponent } from "../../components/invoice-list";
import { InvoiceModalService } from "../../modals/invoice";

type ViewModel = {
    invoices: Signal<Invoice[] | undefined>;
    invoiceError: Signal<string | undefined>;
    isLoading: Signal<boolean>;
    loadInvoices: () => void;
    viewInvoice: (invoice: Invoice) => Promise<void>;
}

@Component({
    selector: "atlas-home",
    templateUrl: "./home.component.html",
    imports: [PageModule, HeaderModule, ActionGroupComponent, IconModule, LoadingOverlayComponent, InvoiceListComponent, ButtonComponent, EmptyStateModule]
})
export class HomeComponent {
    readonly #invoiceModalService = inject(InvoiceModalService);

    readonly #invoiceResource = resource({
        loader: ({ previous }) => previous.status === 'idle' ? Promise.resolve(undefined) : loadInvoices()
    });

    readonly vm: ViewModel = {
        invoices: computed(() => this.#invoiceResource.hasValue() ? this.#invoiceResource.value() : undefined),
        invoiceError: computed(() => this.#invoiceResource.error()?.cause as string | undefined),
        isLoading: this.#invoiceResource.isLoading,
        loadInvoices: this.#invoiceResource.reload.bind(this.#invoiceResource),
        viewInvoice: this.#invoiceModalService.openInvoiceModal.bind(this.#invoiceModalService),
    };
}