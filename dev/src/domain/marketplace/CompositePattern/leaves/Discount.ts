import {DiscountComponent} from "../Components/DiscountComponent";
import {DiscountType, ProductCategory} from "../../../../utilities/Enums";
import {Product} from "../../Product";

export type discountInf = {
    type: DiscountType;
    object: Product | ProductCategory | undefined;
};

export class Discount implements DiscountComponent{

    private info: discountInf;
    private discountPercent: number;

    constructor(discountInf: discountInf, discountPercent: number) {
        this.info = discountInf;
        this.discountPercent = discountPercent;
    }

    calculateProductsPrice(productsPrice: [Product, number][]): [Product, number][] {
        let discProductsPrice: [Product, number][] = [];

            if (this.info.type === DiscountType.Product) {
                let pInDisc = this.info.object;
                for (let [p, price] of productsPrice) {
                    if (p === pInDisc) {
                        discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent)]);
                    } else
                        discProductsPrice.push([p, price]);
                }
            }
            else if (this.info.type === DiscountType.Category) {
                let cInDisc = this.info.object;
                for (let [p, price] of productsPrice) {
                    if (p.category == cInDisc) {
                        discProductsPrice.concat([p, price-(p.fullPrice* 0.01 * this.discountPercent)]);
                    } else
                        discProductsPrice.concat([p, price]);
                }
            }
            else
                for (let [p, price] of productsPrice) {
                    discProductsPrice.concat([p, price-(p.fullPrice* 0.01 * this.discountPercent)]);


        }
        return discProductsPrice;
    }
}