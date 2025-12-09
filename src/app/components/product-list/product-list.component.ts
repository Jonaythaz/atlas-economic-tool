import { ChangeDetectionStrategy, Component, input, output, Signal } from "@angular/core";
import { ItemModule, ListModule, SpinnerComponent, IconComponent } from "@kirbydesign/designsystem";
import { BadgeComponent } from "@kirbydesign/designsystem/badge";
import { Product } from "../../types";

type ViewModel = {
    products: Signal<Product[]>;
    selectProduct: (product: Product) => void;
}

@Component({
    selector: 'atlas-product-list',
    templateUrl: './product-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ListModule, ItemModule, SpinnerComponent, IconComponent, BadgeComponent]
})
export class ProductListComponent {
    readonly products = input.required<Product[]>();
    readonly productSelected = output<Product>();

    readonly vm: ViewModel = {
        products: this.products,
        selectProduct: this.productSelected.emit.bind(this.productSelected),
    };
}
