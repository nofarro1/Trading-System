import {DiscountComponent} from "../Components/DiscountComponent";
import {DiscountType, ProductCategory} from "../../../../utilities/Enums";
import {Product} from "../../Product";
import {SimpleDiscount} from "./SimpleDiscount";


export class ConditionalDiscount implements DiscountComponent{

    private _discount: SimpleDiscount;
    private _predicat: (Products: [Product, number, number][]) => boolean;


    get discount(): SimpleDiscount {
        return this._discount;
    }

    set discount(value: SimpleDiscount) {
        this._discount = value;
    }

    get predicat(): (Products: [Product, number, number][]) => boolean {
        return this._predicat;
    }

    set predicat(value: (Products: [Product, number, number][]) => boolean) {
        this._predicat = value;
    }

    constructor(discount: SimpleDiscount, predicat: (Products: [Product, number, number][]) => boolean) {
        this._discount = discount;
        this._predicat = predicat;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        if(this._predicat(products))
             return this._discount.calculateProductsPrice(products);
        else
            return products;
    }

    predicate(products: [Product, number, number][]): boolean {
        return this._predicat(products);
    }
}