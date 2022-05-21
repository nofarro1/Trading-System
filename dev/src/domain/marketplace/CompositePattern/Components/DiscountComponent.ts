import {ShoppingBag} from "../../ShoppingBag";

export interface DiscountComponent {
    CalculateBagPrice(bag: ShoppingBag): number;
}