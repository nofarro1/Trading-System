import {ShoppingBag} from "../../ShoppingBag";
import {Product} from "../../Product";

export interface DiscountComponent {
    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][];
}