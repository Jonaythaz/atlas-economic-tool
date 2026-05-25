import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { EventBusService } from '@atlas/services/event-bus';
import { InvoiceBookingWorkflowComponent } from '@atlas/smart-components/invoice-booking-workflow';
import { ActionGroupComponent } from '@kirbydesign/designsystem/action-group';
import { ButtonComponent } from '@kirbydesign/designsystem/button';
import { HeaderActionsDirective, HeaderComponent } from '@kirbydesign/designsystem/header';
import { IconComponent } from '@kirbydesign/designsystem/icon';
import { PageModule } from '@kirbydesign/designsystem/page';

type ViewModel = {
	start: () => void;
};

@Component({
	templateUrl: './invoice-booking.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		PageModule,
		HeaderComponent,
		ActionGroupComponent,
		ButtonComponent,
		IconComponent,
		InvoiceBookingWorkflowComponent,
		HeaderActionsDirective,
	],
})
export class InvoiceBookingComponent {
	readonly #eventBus = inject(EventBusService);

	readonly vm: ViewModel = {
		start: this.#eventBus.emitStart.bind(this.#eventBus),
	};
}
