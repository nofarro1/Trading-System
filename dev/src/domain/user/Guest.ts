import {UUIDGenerator} from "../../utilities/Utils";
import { ShoppingCart } from "./ShoppingCart";


export class Guest {
    private _session: string;
    _shoppingCart: ShoppingCart;

    constructor(id: string, shoppingCart: ShoppingCart){
        this._session = id;
        this._shoppingCart = shoppingCart;
    }
    public get session(): string {
            return this._session;
    }
    public set session(value) {
        this._session = value;
    }
    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

}