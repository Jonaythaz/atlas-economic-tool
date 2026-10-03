import { Component, effect, inject } from '@angular/core';
import { startInvoiceStatusScan } from '@atlas/commands';
import { UpdaterModalService } from '@atlas/modals/updater';
import { SettingsService } from '@atlas/services/settings';
import { UpdaterService } from '@atlas/services/updater';
import { KirbyAppModule, RouterOutletModule } from '@kirbydesign/designsystem';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	imports: [KirbyAppModule, RouterOutletModule],
})
export class AppComponent {
	readonly #updaterService = inject(UpdaterService);
	readonly #updaterModalService = inject(UpdaterModalService);
	readonly #settingsService = inject(SettingsService);

	constructor() {
		void this.#startInvoiceStatusScan();
		effect(async () => {
			if (this.#updaterService.updateAvailable()) {
				await this.#updaterModalService.open();
			}
		});
	}

	async #startInvoiceStatusScan(): Promise<void> {
		try {
			const { tokens } = await this.#settingsService.loadSettings();
			if (tokens.secret.trim() && tokens.grant.trim()) {
				await startInvoiceStatusScan(tokens);
			}
		} catch (error) {
			console.error('Unable to start the background invoice status scan.', error);
		}
	}
}
