import {ShopStatus} from "../../Enums";
import {SimpleProduct} from "./SimpleProduct";


export class SimpleShop {
    private readonly _ID: number;
    private readonly _name: string;
    private readonly _status: ShopStatus;
    private readonly _founder: string;
    private readonly _products: {product:SimpleProduct, quantity:number}[]//Map<SimpleProduct, number>; //<SimpleProduct, quantity>
    
    constructor(ID: number, name: string, shopFounder: string, status: ShopStatus, products:{product:SimpleProduct, quantity:number}[]) {
        this._ID = ID;
        this._founder = shopFounder;
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


    get products(): { product: SimpleProduct; quantity: number }[] {
        return this._products;
    }

    public get founder(): string {
        return this._founder;
    }
}