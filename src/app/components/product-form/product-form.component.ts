import { Component, input } from '@angular/core';
import { type FieldTree, FormField } from '@angular/forms/signals';
import type { Product } from '@atlas/types';
import { CardComponent, FormFieldComponent, InputComponent } from '@kirbydesign/designsystem';

@Component({
	selector: 'atlas-product-form',
	templateUrl: './product-form.component.html',
	imports: [CardComponent, FormFieldComponent, InputComponent, FormField],
})
export class ProductFormComponent {
	readonly form = input.required<FieldTree<Required<Product>>>();
}
