import { ChangeDetectionStrategy, Component, input, output, type Signal } from "@angular/core";
import { ItemModule, ListModule } from "@kirbydesign/designsystem";
import type { CustomerResource } from "../../types";
import { StatusIndicatorComponent } from "../status-indicator";

type ViewModel = {
	customers: Signal<CustomerResource[]>;
	selectCustomer: (customer: CustomerResource) => void;
};

@Component({
	selector: "atlas-customer-list",
	templateUrl: "./customer-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListModule, ItemModule, StatusIndicatorComponent],
})
export class CustomerListComponent {
	readonly customers = input.required<CustomerResource[]>();
	readonly customerSelected = output<CustomerResource>();

	readonly vm: ViewModel = {
		customers: this.customers,
		selectCustomer: this.customerSelected.emit.bind(this.customerSelected),
	};
}
