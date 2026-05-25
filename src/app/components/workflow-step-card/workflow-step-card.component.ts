import { Component, input, output } from '@angular/core';
import type { WorkflowState } from '@atlas/types';
import { IconComponent } from '@kirbydesign/designsystem';

import { WorkflowStateIndicatorComponent } from '../workflow-state-indicator/workflow-state-indicator.component';

@Component({
	selector: 'atlas-workflow-step-card',
	templateUrl: './workflow-step-card.component.html',
	styleUrl: './workflow-step-card.component.scss',
	imports: [IconComponent, WorkflowStateIndicatorComponent],
})
export class WorkflowStepCardComponent {
	readonly title = input.required<string>();
	readonly icon = input.required<string>();
	readonly state = input.required<WorkflowState>();
	readonly selected = output();
}
