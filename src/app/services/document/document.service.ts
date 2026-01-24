import { Injectable, type Resource, resource } from "@angular/core";
import { loadDocuments } from "@atlas/commands";
import type { DocumentModel } from "@atlas/models";

@Injectable({ providedIn: "root" })
export class DocumentService {
	readonly #documents = resource({
		loader: ({ previous }) => (previous.status === "idle" ? Promise.resolve(undefined) : loadDocuments()),
	});

	get documents(): Resource<DocumentModel[] | undefined> {
		return this.#documents.asReadonly();
	}

	load(): void {
		this.#documents.reload();
	}
}
