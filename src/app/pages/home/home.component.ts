import { ChangeDetectionStrategy, Component, computed, inject, Signal } from "@angular/core";
import { HeaderModule, PageModule, LoadingOverlayComponent, ButtonComponent, ActionGroupComponent, IconModule, EmptyStateModule } from "@kirbydesign/designsystem";
import { SettingsModalService } from "../../modals/settings";
import { InvoiceService } from "../../services/invoice";
import { InvoiceOverviewComponent } from "../../components/invoice-overview";

type ViewModel = {
    hasInvoices: Signal<boolean>;
    error: Signal<string | undefined>;
    isLoading: Signal<boolean>;
    loadInvoices: () => void;
    openSettings: () => Promise<void>;
};

@Component({
    selector: "atlas-home",
    templateUrl: "./home.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageModule, HeaderModule, ActionGroupComponent, IconModule, LoadingOverlayComponent, ButtonComponent, EmptyStateModule, InvoiceOverviewComponent]
})
export class HomeComponent {
    readonly #invoiceService = inject(InvoiceService);
    readonly #settingsModalService = inject(SettingsModalService);

    readonly vm: ViewModel = {
        hasInvoices: computed(() => this.#invoiceService.invoices().length > 0),
        error: this.#invoiceService.error,
        isLoading: this.#invoiceService.isLoading,
        loadInvoices: this.#invoiceService.loadInvoices.bind(this.#invoiceService),
        openSettings: this.#settingsModalService.open.bind(this.#settingsModalService),
    };
}