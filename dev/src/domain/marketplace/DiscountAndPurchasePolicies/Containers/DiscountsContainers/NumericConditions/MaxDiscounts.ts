import {DiscountComponent} from "../../../Components/DiscountComponent";
import {Product} from "../../../../Product";
import {ContainerDiscountComponent} from "../ContainerDiscountComponent";

export class MaxDiscounts extends ContainerDiscountComponent{

    constructor(id: number, discounts: DiscountComponent[]) {
       super(id, discounts);
        this._description = this.discounts.reduce((acc:string, curr:DiscountComponent)=>{return acc+"\n"+ curr.description}, `The discount that will apply is the one with maximum value. Discounts:`)
    }

    get id(): number {
        return this._id;
    }

    get description(): string {
        return this._description;
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



    predicate(products: [Product, number, number][]): boolean {
        return true;
    }

}