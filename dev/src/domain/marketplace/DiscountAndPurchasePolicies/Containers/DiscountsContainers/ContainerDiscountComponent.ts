import {DiscountComponent} from "../../Components/DiscountComponent";
import {Product} from "../../../Product";
import {DiscountData} from "../../../../../utilities/DataObjects";
import {Entity} from "../../../../../utilities/Entity";

export abstract class ContainerDiscountComponent implements DiscountComponent{
    protected _id: number;
    protected _description: string;
    protected _discounts: DiscountComponent[];

    constructor(id: number, discounts: DiscountComponent[]) {
        this._id = id;
        this._discounts = discounts;
    }
    get discounts(): DiscountComponent[] {
        return this._discounts;
    }

    abstract predicate(products: [Product, number, number][]): boolean ;

    abstract calculateProductsPrice(Products: [Product, number, number][]): [Product, number, number][];

    abstract get id(): number;

    abstract get description(): string;

    addDiscountElement(toAdd: DiscountComponent){

        this.discounts.push(toAdd);
    }
    removeDiscountElement(toRemove: DiscountComponent){
        let i = this.discounts.indexOf(toRemove);
        this.discounts.splice(i, 1);
    }

}