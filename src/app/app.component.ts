import { Component, effect, inject } from "@angular/core";
import { KirbyAppModule, RouterOutletModule } from "@kirbydesign/designsystem";
import { UpdaterModalService } from "./modals/updater";
import { UpdaterService } from "./services/updater";

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
