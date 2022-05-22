import {SimpleProduct} from "../marketplace/SimpleProduct";


export class SimpleShoppingCart {
    private readonly _userId: string;
    private readonly _products: Map<SimpleProduct, number>; //<SimpleProduct, quantity>
    private readonly _totalPrice: number;

    constructor(userId: string, products: Map<SimpleProduct, number>, totalPrice: number) {
        this._userId = userId;
        this._products = products;
        this._totalPrice = totalPrice;
    }

    get userId(): string {
        return this._userId;
    }

    get products(): Map<SimpleProduct, number> {
        return this._products;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }
}