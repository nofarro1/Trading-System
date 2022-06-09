import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";

export class AdditionDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];
    private _id: number;

    constructor(id: number, discounts: DiscountComponent[]) {
        this._id = id;
        this.discounts= [];
    }

    get id(): number {
        return this._id;
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