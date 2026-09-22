import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class InvoicePageService {
	readonly #router = inject(Router);

	async navigate(invoiceId: number): Promise<boolean> {
		return this.#router.navigate(['/invoice', invoiceId]);
	}
}
