import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";
import {Product} from "../../../../Product";

export class OrDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];
    private predicate_1: (productsPrice: [Product, number][]) => boolean;
    private predicate_2: (productsPrice: [Product, number][]) => boolean;

    constructor(discount: DiscountComponent[], pred1: (productsPrice: [Product, number][])=> boolean, pred2: (productsPrice: [Product, number][])=> boolean) {
        this.discounts= discount;
        this.predicate_1 = pred1;
        this.predicate_2= pred2;
    }

    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][] {
        if(this.predicate_1(productsPrice) || this.predicate_2(productsPrice)){
            let callBack = (acc:[Product, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
            return this.discounts.reduce(callBack,productsPrice);
        }
        else{
            return productsPrice;
        }
    }

    addDiscountElement(toAdd: DiscountComponent){}
    removeDiscountElement(toRemove: DiscountComponent){}


}