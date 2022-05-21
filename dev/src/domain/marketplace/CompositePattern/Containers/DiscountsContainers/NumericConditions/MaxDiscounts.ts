import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";

export class MaxDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];

    constructor() {
        this.discounts= [];
    }

    CalculateBagPrice(bag: ShoppingBag): number {
        return 0;
    }

    addDiscountElement(toAdd: DiscountComponent){}
    removeDiscountElement(toRemove: DiscountComponent){}
}