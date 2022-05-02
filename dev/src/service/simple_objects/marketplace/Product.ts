

export class Product {
    private readonly _shopID: number;
    private readonly _productID: number;
    private readonly _productName: string;
    private readonly _productQuantity: number;
    private readonly _description?: string;


    constructor(shopID: number, productID: number, productName: string, productQuantity: number, description?: string) {
        this._shopID = shopID;
        this._productID = productID;
        this._productName = productName;
        this._productQuantity = productQuantity;
        this._description = description;
    }


    get shopID(): number {
        return this._shopID;
    }

    get productID(): number {
        return this._productID;
    }

    get productName(): string {
        return this._productName;
    }

    get productQuantity(): number {
        return this._productQuantity;
    }

    get description(): string {
        return this._description;
    }
}