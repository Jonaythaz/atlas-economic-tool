import { ChangeDetectionStrategy, Component, input, output, Signal } from "@angular/core";
import { ItemModule, ListModule, SpinnerComponent, IconComponent } from "@kirbydesign/designsystem";
import { Customer } from "../../types";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";

type ViewModel = {
    customers: Signal<Customer[]>;
    selectCustomer: (customer: Customer) => void;
}

@Component({
    selector: 'atlas-customer-list',
    templateUrl: './customer-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListModule, ItemModule, SpinnerComponent, IconComponent, BadgeComponent]
})
export class CustomerListComponent {
    readonly customers = input.required<Customer[]>();
    readonly customerSelected = output<Customer>();

    readonly vm: ViewModel = {
        customers: this.customers,
        selectCustomer: this.customerSelected.emit.bind(this.customerSelected),
    };
}