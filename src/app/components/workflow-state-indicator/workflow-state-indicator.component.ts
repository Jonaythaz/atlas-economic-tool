import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import type { WorkflowState } from '@atlas/types';

@Component({
	selector: 'atlas-workflow-state-indicator',
	templateUrl: './workflow-state-indicator.component.html',
	styleUrl: './workflow-state-indicator.component.scss',
	imports: [CommonModule],
	host: {
		'[class]': 'state()',
	},
})
export class WorkflowStateIndicatorComponent {
	readonly state = input.required<WorkflowState>();
}
