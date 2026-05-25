import { Injectable, inject, type Signal, signal } from '@angular/core';
import { fetchSettings, updateSettings } from '@atlas/commands';
import type { Settings } from '@atlas/models';
import type { WorkflowState } from '@atlas/types';

import { EventBusService } from '../event-bus';

@Injectable({ providedIn: 'root' })
export class SettingsService {
	readonly #eventBus = inject(EventBusService);

	readonly #state = signal<WorkflowState>('idle');
	readonly #settings = signal<Settings | undefined>(undefined);
	readonly #error = signal<Error | undefined>(undefined);

	constructor() {
		this.#eventBus.startEvents.subscribe(async () => {
			this.#state.set('running');
			await this.loadSettings().then(
				(settings) => {
					this.#eventBus.emitSettings(settings);
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

	async loadSettings(): Promise<Settings> {
		const settings = this.#settings();
		if (settings) {
			return settings;
		}
		const error = this.#error();
		if (error) {
			throw error;
		}
		return fetchSettings().then(
			(settings) => {
				this.#settings.set(settings);
				this.#error.set(undefined);
				return settings;
			},
			(error) => {
				this.#error.set(error);
				throw error;
			},
		);
	}

	async saveSettings(settings: Settings): Promise<void> {
		this.#settings.set(settings);
		this.#error.set(undefined);
		await updateSettings(settings);
	}
}
