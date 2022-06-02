import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../../user/ShoppingBag";
import {Product} from "../../../../Product";
import {XOR} from 'ts-xor';

export function xor(a: boolean, b: boolean) {
    return !!a !== !!b;
}

export class XorDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];

    constructor(discount: DiscountComponent[], pred1: (Products: [Product, number, number][])=> boolean, pred2: (Products: [Product, number, number][])=> boolean) {
        this.discounts= discount;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let discCallBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
            return this.discounts.reduce(discCallBack,products);
    }


    addDiscountElement(toAdd: DiscountComponent){
        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

    predicate(products: [Product, number, number][]): boolean {
        let predCallbak = (acc:boolean, dc:DiscountComponent) =>  xor(acc, dc.predicate(products));
        return this.discounts.reduce(predCallbak, true);
    }
}