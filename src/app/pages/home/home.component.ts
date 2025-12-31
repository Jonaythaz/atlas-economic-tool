import { ChangeDetectionStrategy, Component, computed, inject, type Signal } from "@angular/core";
import {
	ActionGroupComponent,
	ButtonComponent,
	EmptyStateModule,
	HeaderModule,
	IconModule,
	LoadingOverlayComponent,
	PageModule,
} from "@kirbydesign/designsystem";
import { DocumentOverviewComponent } from "../../components/document-overview";
import { SettingsModalService } from "../../modals/settings";
import { DocumentService } from "../../services/document";

type ViewModel = {
	hasDocuments: Signal<boolean>;
	error: Signal<string | undefined>;
	isLoading: Signal<boolean>;
	loadInvoices: () => void;
	openSettings: () => Promise<void>;
};

@Component({
	selector: "atlas-home",
	templateUrl: "./home.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		HeaderModule,
		ActionGroupComponent,
		IconModule,
		LoadingOverlayComponent,
		ButtonComponent,
		EmptyStateModule,
		DocumentOverviewComponent,
	],
})
export class HomeComponent {
	readonly #documentService = inject(DocumentService);
	readonly #settingsModalService = inject(SettingsModalService);

	readonly vm: ViewModel = {
		hasDocuments: computed(() => this.#documentService.documents().length > 0),
		error: this.#documentService.error,
		isLoading: this.#documentService.isLoading,
		loadInvoices: this.#documentService.load.bind(this.#documentService),
		openSettings: this.#settingsModalService.open.bind(this.#settingsModalService),
	};
}
