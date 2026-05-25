import { Injectable, inject, type Signal, signal } from '@angular/core';
import { loadDocuments } from '@atlas/commands';
import type { WorkflowState } from '@atlas/types';

import { EventBusService } from '../event-bus';

@Injectable({ providedIn: 'root' })
export class DirectoryReadingService {
	readonly #eventBus = inject(EventBusService);

	readonly #state = signal<WorkflowState>('idle');

	constructor() {
		this.#eventBus.startEvents.subscribe(async () => {
			this.#state.set('running');
			await loadDocuments().then(
				(documents) => {
					this.#eventBus.emitDocuments(documents);
					this.#state.set('completed');
				},
				() => {
					this.#state.set('failed');
				},
			);
		});
	}

	get state(): Signal<WorkflowState> {
		return this.#state.asReadonly();
	}
}
