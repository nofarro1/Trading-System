import {ShoppingCart} from "./ShoppingCart";


export class Guest {
    private _session: string;
    private _shoppingCart: ShoppingCart;

    constructor(id: string) {
        this._session = id;
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

    set shoppingCart(value: ShoppingCart) {
        this._shoppingCart = value;
    }
    public getIdentifier(){
        return this.session;
    }
}