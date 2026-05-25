import { linkedSignal } from '@angular/core';
import { type FieldTree, form, required } from '@angular/forms/signals';
import type { Settings } from '@atlas/models';
import type { Defined } from '@atlas/types';

export function settingsForm(settingsFn: () => Settings | null): FieldTree<Defined<Settings>> {
	const model = linkedSignal(() => {
		const settings = settingsFn();
		return {
			tokens: {
				secret: settings?.tokens.secret ?? '',
				grant: settings?.tokens.grant ?? '',
			},
			defaults: {
				customerGroup: settings?.defaults.customerGroup ?? NaN,
				productGroup: settings?.defaults.productGroup ?? NaN,
				paymentTerms: settings?.defaults.paymentTerms ?? NaN,
				vatZone: settings?.defaults.vatZone ?? NaN,
				layout: settings?.defaults.layout ?? NaN,
			},
		};
	});
	return form(model, (schema) => {
		required(schema.tokens.secret, { message: 'Secret token is required' });
		required(schema.tokens.grant, { message: 'Grant token is required' });
	});
}
