import {ShoppingCart} from "./ShoppingCart";
import {BaseEntity, JoinColumn, OneToOne} from "typeorm";

export class Guest extends BaseEntity {
    private _session: string;
    @OneToOne(() => ShoppingCart)
    @JoinColumn()
    private _shoppingCart: ShoppingCart;

    constructor(id: string) {
        super();
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