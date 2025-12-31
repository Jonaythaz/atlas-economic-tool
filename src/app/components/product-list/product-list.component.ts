import { ChangeDetectionStrategy, Component, input, output, type Signal } from "@angular/core";
import { StatusIndicatorComponent } from "@atlas/components/status-indicator";
import type { ProductResource } from "@atlas/types";
import { ItemModule, ListModule } from "@kirbydesign/designsystem";

type ViewModel = {
	products: Signal<ProductResource[]>;
	selectProduct: (product: ProductResource) => void;
};

@Component({
	selector: "atlas-product-list",
	templateUrl: "./product-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [ListModule, ItemModule, StatusIndicatorComponent],
})
export class ProductListComponent {
	readonly products = input.required<ProductResource[]>();
	readonly productSelected = output<ProductResource>();

	readonly vm: ViewModel = {
		products: this.products,
		selectProduct: this.productSelected.emit.bind(this.productSelected),
	};
}
