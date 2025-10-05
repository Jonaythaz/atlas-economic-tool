import { Component } from "@angular/core";
import { KirbyAppModule, RouterOutletModule } from "@kirbydesign/designsystem";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  imports: [KirbyAppModule, RouterOutletModule]
})
export class AppComponent {
}
