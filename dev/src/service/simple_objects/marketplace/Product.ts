import {ProductCategory, productRate} from "../../../domain/marketplace/Product";


export class Product {
    private readonly _productID: number;
    private readonly _productName: string;
    private readonly _shopID: number;
    private readonly _price: number;
    private readonly _category: ProductCategory;
    private readonly _rating: productRate;
    private readonly _description?: string;

    constructor(productID: number, productName: string, shopID: number, price: number, category: ProductCategory, rating: productRate, description: string) {
        this._productID = productID;
        this._productName = productName;
        this._shopID = shopID;
        this._price = price;
        this._category = category;
        this._rating = rating;
        this._description = description;
    }

    get productID(): number {
        return this._productID;
    }

    get productName(): string {
        return this._productName;
    }

    get shopID(): number {
        return this._shopID;
    }

    get price(): number {
        return this._price;
    }

    get category(): ProductCategory {
        return this._category;
    }

    get rating(): productRate {
        return this._rating;
    }

    get description(): string | undefined {
        return this._description;
    }
}