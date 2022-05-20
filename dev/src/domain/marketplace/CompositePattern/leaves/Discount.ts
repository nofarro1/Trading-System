import {DiscountComponent} from "../Components/DiscountComponent";
import {ShoppingBag} from "../../ShoppingBag";

export class Discount implements DiscountComponent{
    CalculateBagPrice(bag: ShoppingBag): number {
        return 0;
    }
}