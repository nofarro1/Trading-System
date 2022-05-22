import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";
import {Product} from "../../../../Product";
import {XOR} from 'ts-xor';

export function xor(a: boolean, b: boolean) {
    return !!a !== !!b;
}

export class XorDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];
    private predicate_1: (Products: [Product, number, number][]) => boolean;
    private predicate_2: (Products: [Product, number, number][]) => boolean;

    constructor(discount: DiscountComponent[], pred1: (Products: [Product, number, number][])=> boolean, pred2: (Products: [Product, number, number][])=> boolean) {
        this.discounts= discount;
        this.predicate_1 = pred1;
        this.predicate_2= pred2;
    }

    calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][] {
        if( xor(this.predicate_1(Products), this.predicate_2(Products))){
            let callBack = (acc:[Product, number, number][], dcCurr: DiscountComponent)=> dcCurr.calculateProductsPrice(acc);
            return this.discounts.reduce(callBack,Products);
        }
        else{
            return Products;
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