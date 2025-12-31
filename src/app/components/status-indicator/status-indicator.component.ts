import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { IconComponent, SpinnerComponent } from "@kirbydesign/designsystem";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";
import type { DocumentResource } from "../../types";

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
