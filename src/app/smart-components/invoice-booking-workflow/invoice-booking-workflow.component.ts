import { Component } from '@angular/core';

import { BillingDocumentsWorkflowStepComponent } from '../billing-documents-workflow-step';
import { CustomersWorkflowStepComponent } from '../customers-workflow-step';
import { DirectoryReadingWorkflowStepComponent } from '../directory-reading-workflow-step';
import { ProductsWorkflowStepComponent } from '../products-workflow-step';
import { SettingsWorkflowStepComponent } from '../settings-workflow-step';

@Component({
	selector: 'atlas-invoice-booking-workflow',
	templateUrl: './invoice-booking-workflow.component.html',
	styleUrl: './invoice-booking-workflow.component.scss',
	imports: [
		SettingsWorkflowStepComponent,
		DirectoryReadingWorkflowStepComponent,
		CustomersWorkflowStepComponent,
		ProductsWorkflowStepComponent,
		BillingDocumentsWorkflowStepComponent,
	],
})
export class InvoiceBookingWorkflowComponent {}
