import {UUIDGenerator} from "../../utilities/Utils";
import { ShoppingCart } from "../marketplace/ShoppingCart";
import { User } from "./User";


export class Guest implements User{
    private readonly _id: string;
    _shoppingCart: ShoppingCart;

    constructor(id: string, shoppingCart: ShoppingCart){
        this._id = id;
        this._shoppingCart = shoppingCart;
    }
    public get id(): string {
            return this._id;
    }

    public get shoppingCart(): ShoppingCart {
        return this._shoppingCart;
    }

}