import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";
import {Product} from "../../../../Product";

export class AdditionDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];

    constructor() {
        this.discounts= [];
    }

    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][] {
        let callBack = (acc:[Product, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
        return this.discounts.reduce(callBack,productsPrice);
    }

    addDiscountElement(toAdd: DiscountComponent){}
    removeDiscountElement(toRemove: DiscountComponent){}


}