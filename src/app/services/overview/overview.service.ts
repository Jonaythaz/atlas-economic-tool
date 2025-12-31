import { computed, Injectable, inject, type Signal, signal } from "@angular/core";
import { fetchSettings } from "@atlas/commands";
import { OVERVIEW_SEGMENTS } from "@atlas/constants";
import { CreditNoteService } from "@atlas/credit-note";
import { CustomerService } from "@atlas/customer";
import { InvoiceService } from "@atlas/invoice";
import type { Settings } from "@atlas/models";
import { ProductService } from "@atlas/product";
import { type CustomerResource, OverviewSegment } from "@atlas/types";
import { type SegmentItem, type ThemeColor, ToastController } from "@kirbydesign/designsystem";

@Injectable({ providedIn: "root" })
export class OverviewService {
	readonly #invoiceService = inject(InvoiceService);
	readonly #creditNoteService = inject(CreditNoteService);
	readonly #customerService = inject(CustomerService);
	readonly #productService = inject(ProductService);
	readonly #toastController = inject(ToastController);

	readonly #creating = signal(false);
	readonly #selectedSegment = signal(OVERVIEW_SEGMENTS[OverviewSegment.Documents]);

	readonly #segments = computed(() => {
		const customerItem = this.#customerService.hasErrors()
			? { ...OVERVIEW_SEGMENTS[OverviewSegment.Customers], badge: ERRORS_BADGE }
			: OVERVIEW_SEGMENTS[OverviewSegment.Customers];
		const productItem = this.#productService.hasErrors()
			? { ...OVERVIEW_SEGMENTS[OverviewSegment.Products], badge: ERRORS_BADGE }
			: OVERVIEW_SEGMENTS[OverviewSegment.Products];
		return [OVERVIEW_SEGMENTS[OverviewSegment.Documents], customerItem, productItem];
	});

	get creating(): Signal<boolean> {
		return this.#creating.asReadonly();
	}

	get selectedSegment(): Signal<SegmentItem> {
		return this.#selectedSegment.asReadonly();
	}

	get segments(): Signal<SegmentItem[]> {
		return this.#segments;
	}

	setSelectedSegment(segment: SegmentItem): void {
		this.#selectedSegment.set(segment);
	}

	async createInvoices(): Promise<void> {
		this.#creating.set(true);
		const settings = await fetchSettings();
		const succesful = await this.#createCustomersAndProducts(settings);
		if (!succesful) {
			this.#toastController.showToast({
				message: "One or more errors occured while creating customers and products",
				messageType: "warning",
			});
			this.#creating.set(false);
			return;
		}
		const customerMap = createCustomerMap(this.#customerService.customers());
		const invoicesPromise = this.#invoiceService.createInvoices(settings, customerMap);
		const creditNotesPromise = this.#creditNoteService.createCreditNotes(settings, customerMap);
		await Promise.all([invoicesPromise, creditNotesPromise]).finally(() => this.#creating.set(false));
	}

	#createCustomersAndProducts(settings: Settings): Promise<boolean> {
		return Promise.all([
			this.#customerService.createCustomers(settings),
			this.#productService.createProducts(settings),
		]).then(([customersSuccessful, productsSuccessful]) => customersSuccessful && productsSuccessful);
	}
}

function createCustomerMap(customers: CustomerResource[]): Map<string, number> {
	return customers.reduce((map, customer) => {
		if (customer.model.externalId) {
			map.set(customer.model.id, customer.model.externalId);
		}
		return map;
	}, new Map<string, number>());
}

type SegmentItemBadge = {
	content?: string;
	icon?: string;
	description?: string;
	themeColor: ThemeColor;
};
const ERRORS_BADGE: SegmentItemBadge = {
	icon: "warning",
	description: "Errors present",
	themeColor: "danger",
};
