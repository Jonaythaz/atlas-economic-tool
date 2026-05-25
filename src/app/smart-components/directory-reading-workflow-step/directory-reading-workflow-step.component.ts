import { Component, inject, type Signal } from '@angular/core';
import { WorkflowStepCardComponent } from '@atlas/components/workflow-step-card';
import { DirectoryReadingService } from '@atlas/services/directory-reading';
import type { WorkflowState } from '@atlas/types';

type ViewModel = {
	title: string;
	icon: string;
	state: Signal<WorkflowState>;
};

@Component({
	selector: 'atlas-directory-reading-workflow-step',
	templateUrl: './directory-reading-workflow-step.component.html',
	imports: [WorkflowStepCardComponent],
})
export class DirectoryReadingWorkflowStepComponent {
	readonly #service = inject(DirectoryReadingService);

	readonly vm: ViewModel = {
		title: 'Read Directory',
		icon: 'accounts-outline',
		state: this.#service.state,
	};
}
