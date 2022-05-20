import {UUIDGenerator} from "../../utilities/Utils";
import { ShoppingCart } from "../marketplace/ShoppingCart";


export class User{
    private _id: number;
    _shoppingCart: ShoppingCart;

    constructor(id: number, shoppingCart: ShoppingCart){
        this._id = id;
        this._shoppingCart = shoppingCart;
    }
    public get id(): number {
            return this._id;
    }

    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

}