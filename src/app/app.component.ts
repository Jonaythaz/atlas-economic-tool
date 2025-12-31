import { Component, effect, inject } from "@angular/core";
import { UpdaterModalService } from "@atlas/modals/updater";
import { UpdaterService } from "@atlas/services/updater";
import { KirbyAppModule, RouterOutletModule } from "@kirbydesign/designsystem";

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	imports: [KirbyAppModule, RouterOutletModule],
})
export class AppComponent {
	readonly #updaterService = inject(UpdaterService);
	readonly #updaterModalService = inject(UpdaterModalService);

	constructor() {
		effect(async () => {
			if (this.#updaterService.updateAvailable()) {
				await this.#updaterModalService.open();
			}
		});
	}
}
