import {ShoppingBag} from "./ShoppingBag";


export class ShoppingCart {
    private readonly _userId: string;
    private readonly _totalPrice: number;


    constructor(userId: string, totalPrice: number) {
        this._userId = userId;
        this._totalPrice = totalPrice;
    }


    get userId(): string {
        return this._userId;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }
}