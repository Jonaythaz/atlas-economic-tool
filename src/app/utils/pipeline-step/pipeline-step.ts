import { type Resource, type Signal, signal } from '@angular/core';
import type { PipelineStatus } from '@atlas/types';
import type { PipelineItem } from '@atlas/utils/pipeline-item';

type ExtractPipelineTypes<T> = T extends PipelineItem<infer I, infer O, infer D> ? [I, O, D] : never;

export function pipelineStep<Item extends PipelineItem<unknown, unknown, unknown>>(
	items: Resource<Item[] | undefined>,
): PipelineStep<Item, ExtractPipelineTypes<Item>[0], ExtractPipelineTypes<Item>[1], ExtractPipelineTypes<Item>[2]> {
	return new PipelineStep(items);
}

export class PipelineStep<Item extends PipelineItem<I, O, D>, I = unknown, O = unknown, D = unknown> {
	readonly #items: Resource<Item[] | undefined>;
	readonly #status = signal<PipelineStatus>('pending');

	constructor(items: Resource<Item[] | undefined>) {
		this.#items = items;
	}

	get items(): Resource<Item[] | undefined> {
		return this.#items;
	}

	get status(): Signal<PipelineStatus> {
		return this.#status.asReadonly();
	}

	async start(dependencies: D): Promise<Map<string, O>> {
		if (!this.#items.hasValue()) {
			throw new Error('No items to process');
		}
		this.#status.set('in-progress');

		const results = await Promise.all(this.#items.value().map((item) => this.#processItem(item, dependencies)));

		this.#status.set('completed');

		return new Map(results);
	}

	async #processItem(item: Item, dependencies: D): Promise<[string, O]> {
		try {
			const output = await item.process(dependencies);
			return [item.key, output];
		} catch (error) {
			this.#status.set('failed');
			throw error;
		}
	}
}
