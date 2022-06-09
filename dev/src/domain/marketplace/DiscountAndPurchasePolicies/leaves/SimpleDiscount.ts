import {DiscountComponent} from "../Components/DiscountComponent";
import {DiscountType} from "../../../../utilities/Enums";
import {Product} from "../../Product";
import {discountInf} from "../../../../utilities/Types";



export class SimpleDiscount implements DiscountComponent{

    private info: discountInf;
    private discountPercent: number;

    constructor(discountInf: discountInf, discountPercent: number) {
        this.info = discountInf;
        this.discountPercent = discountPercent;
    }



    calculateProductsPrice(products: [Product, number, number][]): [Product, number, number][] {
        let discProductsPrice: [Product, number, number][] = [];

        if (this.info.type === DiscountType.Product) {
            let pInDisc = this.info.object;
            for (let [p, price, quantity] of products) {
                if (p === pInDisc) {
                    discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);
                } else
                    discProductsPrice.push([p, price, quantity]);
            }
        }
        else if (this.info.type === DiscountType.Category) {
            let cInDisc = this.info.object;
            for (let [p, price, quantity] of products) {
                if (p.category == cInDisc) {
                    discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);
                } else
                    discProductsPrice.push([p, price, quantity]);
            }
        }
        else
            for (let [p, price, quantity] of products) {
                discProductsPrice.push([p, price-(p.fullPrice* 0.01 * this.discountPercent), quantity]);


            }
        return discProductsPrice;
    }

    predicate(products: [Product, number, number][]): boolean {
        return true;
    }
}