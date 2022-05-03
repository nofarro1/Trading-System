import {Product} from "../marketplace/Product";


export class ShopOrder {
    private readonly _shopId: number;
    private readonly _products: Map<Product, number>; //<Product, quantity>
    private readonly _totalPrice: number;
    private readonly _creationDate: Date;

    constructor(shopId: number, products: Map<Product, number>, totalPrice: number, creationDate: Date) {
        this._shopId = shopId;
        this._products = products;
        this._totalPrice = totalPrice;
        this._creationDate = creationDate;
    }

    get shopId(): number {
        return this._shopId;
    }

    get products(): Map<Product, number> {
        return this._products;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get creationDate(): Date {
        return this._creationDate;
    }
}
