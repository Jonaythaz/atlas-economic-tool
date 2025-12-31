import { computed, Injectable, resource, type Signal } from "@angular/core";
import { loadDocuments } from "../../commands";
import type { DocumentModel } from "../../models";

@Injectable({ providedIn: "root" })
export class DocumentService {
	readonly #documentResource = resource({
		loader: ({ previous }) => (previous.status === "idle" ? Promise.resolve(undefined) : loadDocuments()),
	});

	readonly #documents = computed(() => (this.#documentResource.hasValue() ? this.#documentResource.value() : []));
	readonly #error = computed(() => this.#documentResource.error()?.message);

	get documents(): Signal<DocumentModel[]> {
		return this.#documents;
	}

	get error(): Signal<string | undefined> {
		return this.#error;
	}

	get isLoading(): Signal<boolean> {
		return this.#documentResource.isLoading;
	}

	load(): void {
		this.#documentResource.reload();
	}
}
