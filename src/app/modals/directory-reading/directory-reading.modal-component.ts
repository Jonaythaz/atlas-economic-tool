import { ChangeDetectionStrategy, Component, inject, type Signal } from '@angular/core';
import { DirectoryReadingService } from '@atlas/services/directory-reading';
import { FlagComponent, PageModule } from '@kirbydesign/designsystem';

type ViewModel = {
	errorMessage: Signal<string | undefined>;
};

@Component({
	templateUrl: './directory-reading.modal-component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [PageModule, FlagComponent],
})
export class DirectoryReadingModalComponent {
	readonly #directoryReadingService = inject(DirectoryReadingService);

	readonly vm: ViewModel = {
		errorMessage: this.#directoryReadingService.errorMessage,
	};
}
