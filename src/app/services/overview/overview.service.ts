import { computed, Injectable, inject, type Signal, signal, type WritableSignal } from '@angular/core';
import { fetchSettings } from '@atlas/commands';
import { OVERVIEW_SEGMENTS } from '@atlas/constants';
import { DocumentService } from '@atlas/services/document';
import { OverviewSegment } from '@atlas/types';
import { type SegmentItem, type ThemeColor, ToastController } from '@kirbydesign/designsystem';

@Injectable({ providedIn: 'root' })
export class OverviewService {
	readonly #toastController = inject(ToastController);
	readonly #documentService = inject(DocumentService);

	readonly #creating = signal(false);
	readonly #selectedSegmentIndex = signal(0);

	readonly #segments = computed(() => [
		{
			...OVERVIEW_SEGMENTS[OverviewSegment.Documents],
			badge: this.#documentService.invoicePipelineStep.status() === 'failed' ? ERRORS_BADGE : undefined,
		},
		{
			...OVERVIEW_SEGMENTS[OverviewSegment.Customers],
			badge: this.#documentService.customerPipelineStep.status() === 'failed' ? ERRORS_BADGE : undefined,
		},
		{
			...OVERVIEW_SEGMENTS[OverviewSegment.Products],
			badge: this.#documentService.productPipelineStep.status() === 'failed' ? ERRORS_BADGE : undefined,
		},
	]);

	get creating(): Signal<boolean> {
		return this.#creating.asReadonly();
	}

	get selectedSegmentIndex(): WritableSignal<number> {
		return this.#selectedSegmentIndex;
	}

	get segments(): Signal<SegmentItem[]> {
		return this.#segments;
	}

	async createInvoices(): Promise<void> {
		this.#creating.set(true);
		const settings = await fetchSettings();
		await Promise.all([
			this.#documentService.customerPipelineStep.start(settings),
			this.#documentService.productPipelineStep.start(settings),
		])
			.then(([customerMap, productMap]) =>
				this.#documentService.invoicePipelineStep.start({ customerMap, productMap, settings }),
			)
			.catch(() => {
				this.#toastController.showToast({
					message: 'One or more errors occured while creating invoices',
					messageType: 'warning',
				});
			})
			.finally(() => {
				this.#creating.set(false);
			});
	}
}

type SegmentItemBadge = {
	content?: string;
	icon?: string;
	description?: string;
	themeColor: ThemeColor;
};

const ERRORS_BADGE: SegmentItemBadge = {
	icon: 'warning',
	description: 'Errors present',
	themeColor: 'danger',
};
