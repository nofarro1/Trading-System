

export class ShopOrder {
    private readonly _shopId: string;
    private readonly _products: number[];
    private readonly _totalPrice: number;
    private readonly _creationDate: number;


    constructor(shopId: string, products: Array<number>, totalPrice: number, creationDate: number) {
        this._shopId = shopId;
        this._products = products;
        this._totalPrice = totalPrice;
        this._creationDate = creationDate;
    }


    get shopId(): string {
        return this._shopId;
    }

    get products(): number[] {
        return this._products;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get creationDate(): number {
        return this._creationDate;
    }
}