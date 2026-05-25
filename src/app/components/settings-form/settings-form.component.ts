import { Component, input } from '@angular/core';
import { type FieldTree, FormField } from '@angular/forms/signals';
import type { Settings } from '@atlas/models';
import type { Defined } from '@atlas/types';
import { CardComponent, FormFieldComponent, InputComponent, SectionHeaderComponent } from '@kirbydesign/designsystem';

@Component({
	selector: 'atlas-settings-form',
	templateUrl: './settings-form.component.html',
	imports: [SectionHeaderComponent, CardComponent, FormFieldComponent, InputComponent, FormField],
})
export class SettingsFormComponent {
	readonly form = input.required<FieldTree<Defined<Settings>>>();
}
