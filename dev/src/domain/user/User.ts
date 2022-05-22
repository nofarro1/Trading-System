import {UUIDGenerator} from "../../utilities/Utils";
import { ShoppingCart } from "../marketplace/ShoppingCart";


export class User{
    private _session: string;
    _shoppingCart: ShoppingCart;

    constructor(id: string, shoppingCart: ShoppingCart){
        this._session = id;
        this._shoppingCart = shoppingCart;
    }
    public get session(): string {
            return this._session;
    }

    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

}