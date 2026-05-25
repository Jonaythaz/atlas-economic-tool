import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { SettingsModalService } from '@atlas/modals/settings';
import { SettingsService } from '@atlas/services/settings';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
	view: () => Promise<void>;
};

@Component({
	selector: 'atlas-settings-workflow-step',
	templateUrl: './settings-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class SettingsWorkflowStepComponent {
	readonly #service = inject(SettingsService);
	readonly #modalService = inject(SettingsModalService);

	readonly vm: ViewModel = {
		title: 'Load Settings',
		icon: 'cog',
		state: this.#service.state,
		view: this.#modalService.open.bind(this.#modalService),
	};
}
