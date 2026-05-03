import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { PipelineStatus } from '@atlas/types';
import { IconComponent } from '@kirbydesign/designsystem';
import { BadgeComponent } from '@kirbydesign/designsystem/badge';

@Component({
	selector: 'atlas-status-indicator',
	templateUrl: './status-indicator.component.html',
	styles: ':host { display: inline-flex; }',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [BadgeComponent, IconComponent],
})
export class StatusIndicatorComponent {
	readonly status = input.required<PipelineStatus>();
}
