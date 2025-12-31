import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import type { DocumentResource } from "@atlas/types";
import { IconComponent, SpinnerComponent } from "@kirbydesign/designsystem";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";

@Component({
	selector: "atlas-status-indicator",
	templateUrl: "./status-indicator.component.html",
	styles: ":host { display: inline-flex; }",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [SpinnerComponent, BadgeComponent, IconComponent],
})
export class StatusIndicatorComponent {
	readonly status = input.required<DocumentResource<never>["status"]>();
}
