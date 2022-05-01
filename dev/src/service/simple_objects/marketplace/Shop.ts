

export class Shop {
    private readonly _ID: number;
    private readonly _founderID: string;
    private readonly _personnelIDs: string[];
    private readonly _products: number[];

    constructor(shopID: number, founderID: string, personnelIDs: string[], products: number[]) {
        this._ID = shopID;
        this._founderID = founderID;
        this._personnelIDs = personnelIDs;
        this._products = products;
    }


    get ID(): number {
        return this._ID;
    }

    get founderID(): string {
        return this._founderID;
    }

    get personnelIDs(): string[] {
        return this._personnelIDs;
    }

    get products(): number[] {
        return this._products;
    }
}