import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";
import {Product} from "../../../../Product";

export class OrDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];
    private predicate_1: (Products: [Product, number, number][]) => boolean;
    private predicate_2: (Products: [Product, number, number][]) => boolean;

    constructor(discount: DiscountComponent[], pred1: (Products: [Product, number, number][])=> boolean, pred2: (Products: [Product, number, number][])=> boolean) {
        this.discounts= discount;
        this.predicate_1 = pred1;
        this.predicate_2= pred2;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        if(this.predicate_1(products) || this.predicate_2(products)){
            let callBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
            return this.discounts.reduce(callBack,products);
        }
        else{
            return products;
        }
    }


    addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }


}