import { ChangeDetectionStrategy, Component, inject, type Resource } from "@angular/core";
import { DocumentOverviewComponent } from "@atlas/components/document-overview";
import { SettingsModalService } from "@atlas/modals/settings";
import type { DocumentModel } from "@atlas/models";
import { DocumentService } from "@atlas/services/document";
import {
	ActionGroupComponent,
	ButtonComponent,
	EmptyStateModule,
	HeaderModule,
	IconModule,
	LoadingOverlayComponent,
	PageModule,
} from "@kirbydesign/designsystem";

type ViewModel = {
	documents: Resource<DocumentModel[] | undefined>;
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
		documents: this.#documentService.documents,
		loadInvoices: this.#documentService.load.bind(this.#documentService),
		openSettings: this.#settingsModalService.open.bind(this.#settingsModalService),
	};
}
