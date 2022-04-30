import {ShoppingBag} from "./ShoppingBag";


export class ShoppingCart {
    private userId: string;
    private totalPrice: number;


    constructor(userId: string, totalPrice: number) {
        this.userId = userId;
        this.totalPrice = totalPrice;
    }
}