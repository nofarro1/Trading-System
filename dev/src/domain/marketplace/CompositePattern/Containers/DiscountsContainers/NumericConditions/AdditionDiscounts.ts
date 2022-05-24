import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../../user/ShoppingBag";
import {Product} from "../../../../Product";

export class AdditionDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];

    constructor() {
        this.discounts= [];
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let callBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
        return this.discounts.reduce(callBack, products);
    }

    addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    predicate(products: [Product, number, number][]): boolean {
        return true;
    }


}