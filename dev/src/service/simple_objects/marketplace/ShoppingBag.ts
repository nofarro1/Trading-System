

export class ShoppingBag {
    private readonly _userId: string;
    private readonly _shopID: string;
    private readonly _products: number[];


    constructor(userId: string, shopID: string, products: number[]) {
        this._userId = userId;
        this._shopID = shopID;
        this._products = products;
    }


    get userId(): string {
        return this._userId;
    }

    get shopID(): string {
        return this._shopID;
    }

    get products(): number[] {
        return this._products;
    }
}