import { Component, computed, input, type Signal } from '@angular/core';
import { type FieldTree, FormField } from '@angular/forms/signals';
import type { BusinessCustomer, Customer, Defined, PrivateCustomer } from '@atlas/types';
import { CardComponent, FormFieldComponent, InputComponent } from '@kirbydesign/designsystem';

type ViewModel<T> = {
	form: Signal<FieldTree<T>>;
	isBusinessCustomer: () => this is ViewModel<Defined<BusinessCustomer>>;
	isPrivateCustomer: () => this is ViewModel<Defined<PrivateCustomer>>;
};

@Component({
	selector: 'atlas-customer-form',
	templateUrl: './customer-form.component.html',
	imports: [CardComponent, FormFieldComponent, InputComponent, FormField],
})
export class CustomerFormComponent {
	readonly form = input.required<FieldTree<Defined<Customer>>>();

	readonly #isBusinessCustomer = computed(() => this.form().type().value() === 'business');

	readonly vm: ViewModel<Defined<Customer>> = {
		form: this.form,
		isBusinessCustomer: (): this is ViewModel<Defined<BusinessCustomer>> => this.#isBusinessCustomer(),
		isPrivateCustomer: (): this is ViewModel<Defined<PrivateCustomer>> => !this.#isBusinessCustomer(),
	};
}
