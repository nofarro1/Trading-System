import { shopStatus } from "../../../utilities/Enums";
import {Product} from "./Product";


export class Shop {
    private readonly _ID: number;
    private readonly _name: string;
    private readonly _status: shopStatus;
    private readonly _products: Map<Product, number>; //<Product, quantity>

    constructor(ID: number, name: string, status: shopStatus, products: Map<Product, number>) {
        this._ID = ID;
        this._name = name;
        this._status = status;
        this._products = products;
    }

    get ID(): number {
        return this._ID;
    }

    get name(): string {
        return this._name;
    }

    get status(): shopStatus {
        return this._status;
    }

    get products(): Map<Product, number> {
        return this._products;
    }
}