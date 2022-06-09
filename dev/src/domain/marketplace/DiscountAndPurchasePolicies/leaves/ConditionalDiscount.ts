import {DiscountComponent} from "../Components/DiscountComponent";
import {Product} from "../../Product";
import {SimpleDiscount} from "./SimpleDiscount";
import {PredicateDiscountPolicy} from "../Predicates/PredicateDiscountPolicy";


export class ConditionalDiscount implements DiscountComponent{

    private _discount: SimpleDiscount;
    private _pred: PredicateDiscountPolicy;


    get discount(): SimpleDiscount {
        return this._discount;
    }

    set discount(value: SimpleDiscount) {
        this._discount = value;
    }


    constructor(discount: SimpleDiscount, predicat: PredicateDiscountPolicy) {
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
}