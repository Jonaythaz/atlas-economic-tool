import { inject } from '@angular/core';
import {
	type ActivatedRouteSnapshot,
	RedirectCommand,
	type ResolveFn,
	Router,
	type RouterStateSnapshot,
} from '@angular/router';
import { InvoiceService } from '@atlas/services/invoice';
import type { InvoiceWorkflowItem } from '@atlas/workflow-items/invoice';
import { ToastController } from '@kirbydesign/designsystem';

export const invoiceResolver: ResolveFn<InvoiceWorkflowItem> = async (
	route: ActivatedRouteSnapshot,
	_state: RouterStateSnapshot,
) => {
	const invoiceService = inject(InvoiceService);
	const toastController = inject(ToastController);
	const router = inject(Router);

	const invoiceId = Number(route.paramMap.get('id'));
	const invoice = invoiceService.invoices().find((invoice) => invoice.value().id === invoiceId);

	if (invoice === undefined) {
		await toastController.showToast({
			message: 'Could not find invoice to show',
			messageType: 'warning',
		});
		return new RedirectCommand(router.parseUrl('/'));
	}

	return invoice;
};
