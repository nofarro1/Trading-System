import {Product} from "./Product";


export class Shop {
    private readonly _ID: number;
    private readonly _name: string;
    private readonly _isActive: boolean;
    private readonly _products: Map<Product, number>; //<Product, quantity>

    constructor(ID: number, name: string, isActive: boolean, products: Map<Product, number>) {
        this._ID = ID;
        this._name = name;
        this._isActive = isActive;
        this._products = products;
    }

    get ID(): number {
        return this._ID;
    }

    get name(): string {
        return this._name;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get products(): Map<Product, number> {
        return this._products;
    }
}