import { Injectable } from '@angular/core';
import type { Documents, Settings } from '@atlas/models';
import type { CreatedCustomer, CreatedProduct } from '@atlas/types';
import { type Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventBusService {
	readonly #startEvents = new Subject<void>();
	readonly #documentsEvents = new Subject<Documents>();
	readonly #settingsEvents = new Subject<Settings>();
	readonly #customerMapEvents = new Subject<Map<string, CreatedCustomer>>();
	readonly #productMapEvents = new Subject<Map<string, CreatedProduct>>();

	get startEvents(): Observable<void> {
		return this.#startEvents.asObservable();
	}

	get documentsEvents(): Observable<Documents> {
		return this.#documentsEvents.asObservable();
	}

	get settingsEvents(): Observable<Settings> {
		return this.#settingsEvents.asObservable();
	}

	get customerMapEvents(): Observable<Map<string, CreatedCustomer>> {
		return this.#customerMapEvents.asObservable();
	}

	get productMapEvents(): Observable<Map<string, CreatedProduct>> {
		return this.#productMapEvents.asObservable();
	}

	emitStart(): void {
		this.#startEvents.next();
	}

	emitDocuments(documents: Documents): void {
		this.#documentsEvents.next(documents);
	}

	emitSettings(settings: Settings): void {
		this.#settingsEvents.next(settings);
	}

	emitCustomerMap(customerMap: Map<string, CreatedCustomer>): void {
		this.#customerMapEvents.next(customerMap);
	}

	emitProductMap(productMap: Map<string, CreatedProduct>): void {
		this.#productMapEvents.next(productMap);
	}
}
