import {UserID} from "../../../utilities/Utils";
import {Product} from "./Product";


export class ShoppingCart {
    private readonly _userId: UserID;
    private readonly _products: Map<Product, number>; //<Product, quantity>
    private readonly _totalPrice: number;

    constructor(userId: UserID, products: Map<Product, number>, totalPrice: number) {
        this._userId = userId;
        this._products = products;
        this._totalPrice = totalPrice;
    }

    get userId(): UserID {
        return this._userId;
    }

    get products(): Map<Product, number> {
        return this._products;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }
}