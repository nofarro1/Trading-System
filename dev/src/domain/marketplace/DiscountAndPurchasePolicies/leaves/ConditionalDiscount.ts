import {DiscountComponent} from "../Components/DiscountComponent";
import {Product} from "../../Product";
import {SimpleDiscount} from "./SimpleDiscount";
import {PredicateDiscountPolicy} from "../Predicates/PredicateDiscountPolicy";


export class ConditionalDiscount implements DiscountComponent{
    private _id: number;
    private _discount: SimpleDiscount;
    private _pred: PredicateDiscountPolicy;


    get description(): string {
        return this._discount.description+" "+ this._pred.description;
    }

    get id(): number {
        return this._id;
    }

    get discount(): SimpleDiscount {
        return this._discount;
    }

    set discount(value: SimpleDiscount) {
        this._discount = value;
    }


    constructor(id: number, discount: SimpleDiscount, predicat: PredicateDiscountPolicy) {
        this._id= id;
        this._discount = discount;
        this._pred = predicat;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        if(this.predicate(products))
             return this._discount.calculateProductsPrice(products);
        else
            return products;
    }

    predicate(products: [Product, number, number][]): boolean {
        return this._pred.checkPredicate(products);
    }

    static findById(containingDiscount: number): Promise<ConditionalDiscount> {
        return undefined;
    }

    delete(...params: any) {
    }

    save(...params: any) {
    }

    update(...params: any) {
    }
}