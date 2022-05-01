

export class BuyerOrder {
    private readonly _userId: string;
    private readonly _shopOrderIDs: number[];
    private readonly _totalPrice: number;
    private readonly _creationDate: number;


    constructor(userId: string, shopOrderIDs: Array<number>, totalPrice: number, creationDate: number) {
        this._userId = userId;
        this._shopOrderIDs = shopOrderIDs;
        this._totalPrice = totalPrice;
        this._creationDate = creationDate;
    }


    get userId(): string {
        return this._userId;
    }

    get shopOrderIDs(): number[] {
        return this._shopOrderIDs;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get creationDate(): number {
        return this._creationDate;
    }
}