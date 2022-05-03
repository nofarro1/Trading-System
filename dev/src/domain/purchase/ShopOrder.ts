import { Product } from "../marketplace/Product";



export class ShopOrder {
    private _id: number;
    private _shopId: number;
    private _products: Product[];
    private _totalPrice: number;
    private _creationTime: string;

    constructor(id: number, shopId: number, products: Product[], totalPrices: number, creationTime: string){
        this._id = id;
        this._shopId = shopId;
        this._products = products;
        this._totalPrice = totalPrices;
        this._creationTime = creationTime;
    }


    get id(): number {
        return this._id;
    }

    set id(value: number) {
        this._id = value;
    }

    get shopId(): number {
        return this._shopId;
    }

    set shopId(value: number) {
        this._shopId = value;
    }

    get products(): Product[] {
        return this._products;
    }

    set products(value: Product[]) {
        this._products = value;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    set totalPrice(value: number) {
        this._totalPrice = value;
    }

    get creationTime(): string {
        return this._creationTime;
    }

    set creationTime(value: string) {
        this._creationTime = value;
    }
}