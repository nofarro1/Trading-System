import { Product } from "../marketplace/Product";



export class ShopOrder {
    private _id: number;

    private _shopId: number;

    private _products: Map<number, [Product, number]>;
;
    private _totalPrice: number;
   
    private _creationTime: string;
  

    constructor(id: number, shopId: number, products: Map<number, [Product, number]>, totalPrices: number, creationTime: string){
        this._id = id;
        this._shopId = shopId;
        this._products = products;
        this._totalPrice = totalPrices;
        this._creationTime = creationTime;
    }

    public get id(): number {
        return this._id;
    }
    
    public get shopId(): number {
        return this._shopId;
    }
    // public set shopId(value: number) {
    //     this._shopId = value;
    // }

    public get products(): Map<number, [Product, number]> {
        return this._products;
    }

    public set products(value: Map<number, [Product, number]>) {
        this._products = value;
    }

    public get totalPrice(): number {
        return this._totalPrice;
    }
    public set totalPrice(value: number) {
        this._totalPrice = value;
    }

    public get creationTime(): string {
        return this._creationTime;
    }
    public set creationTime(value: string) {
        this._creationTime = value;
    }

}