import { ShopStatus } from "../../Enums";
import {SimpleProduct} from "./SimpleProduct";


export class SimpleShop {
    private readonly _ID: number;
    private readonly _name: string;
    private readonly _status: ShopStatus;
    private readonly _products: Map<SimpleProduct, number>; //<SimpleProduct, quantity>

    constructor(ID: number, name: string, status: ShopStatus, products: Map<SimpleProduct, number>) {
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

    get status(): ShopStatus {
        return this._status;
    }

    get products(): Map<SimpleProduct, number> {
        return this._products;
    }
}