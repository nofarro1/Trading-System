import {DiscountComponent} from "../Components/DiscountComponent";
import {ShoppingBag} from "../../ShoppingBag";
import {DiscountType, ProductCategory} from "../../../../utilities/Enums";
import {Product} from "../../Product";

type discountInf = {
    type: DiscountType;
    object: Product | ProductCategory | undefined;
};

export class Discount implements DiscountComponent{

    private info: discountInf;
    private discountPercent: number;
    private _applyDisc: boolean;

    constructor(discountInf: discountInf, discountPrecent: number) {
        this.info = discountInf;
        this.discountPercent = discountPrecent;
        this._applyDisc = true;
    }

    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][] {
        let discProductsPrice: [Product, number][] = [];

            if (this.info.type == DiscountType.Product) {
                let pInDisc = this.info.object;
                for (let [p, price] of productsPrice) {
                    if (p.id == pInDisc) {
                        discProductsPrice.concat([p, price * 0.01 * (100-this.discountPercent)]);
                    } else
                        discProductsPrice.concat([p, price]);
                }
            }
            else if (this.info.type = DiscountType.Category) {
                let cInDisc = this.info.object;
                for (let [p, price] of productsPrice) {
                    if (p.category == cInDisc) {
                        discProductsPrice.concat([p, price * 0.01 * (100-this.discountPercent)]);
                    } else
                        discProductsPrice.concat([p, price]);
                }
            }
            else
                for (let [p, price] of productsPrice) {
                    discProductsPrice.concat([p, price * 0.01 * (100-this.discountPercent)]);


        }
        return discProductsPrice;
    }

    // private extractProducts(shopProducts: Map<number, [Product, number]>): Product[]{
    //     let productsList = [];
    //     for(let tuple of shopProducts){ productsList.push(tuple[1][0])}
    //     return productsList;
    // }
}