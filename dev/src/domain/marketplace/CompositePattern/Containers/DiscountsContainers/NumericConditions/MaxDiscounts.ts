import {DiscountComponent} from "../../../Components/DiscountComponent";
import {ShoppingBag} from "../../../../ShoppingBag";
import {Product} from "../../../../Product";

export class MaxDiscounts implements DiscountComponent{
    private discounts: DiscountComponent[];

    constructor() {
        this.discounts= [];
    }
    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][] {
        let callBack = (disc: DiscountComponent) => disc.calculateProductsPrice(productsPrice);
        let tempProductsPrices = this.discounts.map(callBack);
        let tempTotalPrices = tempProductsPrices.map(this.calculateTotalBagPrice);
        // After calculating all the possible prices for the bag, find the maximum price and return the respective products' prices.
        let max =0, ind=0;
        for (let i=0 ; i< tempTotalPrices.length ; i++){
            if (tempTotalPrices[i] > max){
                max = tempTotalPrices[i];
                ind = i;
            }
        }
        return tempProductsPrices[ind];
    }
    private calculateTotalBagPrice(productsPrice: [Product, number][]): number {
        let totalPrice = 0;
        for (let productPrice of productsPrice){
            totalPrice+= productPrice[1];
        }
        return totalPrice;
    }

    addDiscountElement(toAdd: DiscountComponent){}
    removeDiscountElement(toRemove: DiscountComponent){}

}