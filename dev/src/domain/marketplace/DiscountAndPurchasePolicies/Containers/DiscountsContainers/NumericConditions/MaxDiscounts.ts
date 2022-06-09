import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";

export class MaxDiscounts implements DiscountComponent{
    private _id: number;
    private discounts: DiscountComponent[];

    constructor(id: number, discounts: DiscountComponent[]) {
       this._id = id;
        this.discounts= [];
    }

    get id(): number {
        return this._id;
    }

    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let callBack = (disc: DiscountComponent) => disc.calculateProductsPrice(products);
        let tempProductsPrices = this.discounts.map(callBack);
        let tempBagTotalPrices = tempProductsPrices.map(this.calculateTotalBagPrice);
        // After calculating all the possible prices for the bag, find the maximum price and return the respective products' prices.
        let min= tempBagTotalPrices[0], ind=0;
        for (let i=1 ; i< tempBagTotalPrices.length ; i++){
            if (tempBagTotalPrices[i] < min){
                min = tempBagTotalPrices[i];
                ind = i;
            }
        }
        return tempProductsPrices[ind];
    }
    private calculateTotalBagPrice(productsPrice: [Product, number, number][]): number {
        let totalPrice = 0;
        for (let productPrice of productsPrice){
            totalPrice+= productPrice[1];
        }
        return totalPrice;
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