import { ChangeDetectionStrategy, Component, input } from "@angular/core";
import { DocumentResource } from "../../types";
import { SpinnerComponent, IconComponent } from "@kirbydesign/designsystem";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";

@Component({
    selector: 'atlas-status-indicator',
    templateUrl: './status-indicator.component.html',
    styles: ':host { display: inline-flex; }',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [SpinnerComponent, BadgeComponent, IconComponent]
})
export class StatusIndicatorComponent {
    readonly status = input.required<DocumentResource<never, never>['status']>();
}