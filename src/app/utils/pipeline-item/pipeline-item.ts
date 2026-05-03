import { type Signal, signal, type WritableSignal } from '@angular/core';
import type { PipelineStatus } from '@atlas/types';

export abstract class PipelineItem<Input, Output, Dependencies> {
	readonly #input: WritableSignal<Input>;
	readonly #key: string;
	readonly #status = signal<PipelineStatus>('pending');
	readonly #output = signal<Output | undefined>(undefined);
	readonly #error = signal<Error | undefined>(undefined);

	constructor(input: Input, key: string) {
		this.#input = signal(input);
		this.#key = key;
	}

	get input(): Signal<Input> {
		return this.#input.asReadonly();
	}

	get key(): string {
		return this.#key;
	}

	get status(): Signal<PipelineStatus> {
		return this.#status.asReadonly();
	}

	get output(): Signal<Output | undefined> {
		return this.#output.asReadonly();
	}

	get error(): Signal<Error | undefined> {
		return this.#error.asReadonly();
	}

	set input(value: Input) {
		this.#input.set(value);
	}

	async process(dependencies: Dependencies): Promise<Output> {
		const output = this.output();
		if (output) {
			return output;
		}

		this.#status.set('in-progress');

		try {
			const output = await this.processInternal(dependencies);

			this.#output.set(output);
			this.#error.set(undefined);
			this.#status.set('completed');

			return output;
		} catch (error) {
			const errorObj = error instanceof Error ? error : new Error('Unknown error');

			this.#output.set(undefined);
			this.#error.set(errorObj);
			this.#status.set('failed');

			throw errorObj;
		}
	}

	protected abstract processInternal(dependencies: Dependencies): Promise<Output>;
}
