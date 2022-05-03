import { ShopOrder } from "./ShopOrder";


export enum OrderStatus {
    Approved,
    Packed,
    Sent
}
export class BuyerOrder {
    private _orderNum: number;
    private _userId: number | string;
    private _shopOrders: Set<BuyerOrder>;
    private _totalPrice: number;
    private _creationTime: Date;
    
    constructor(orderNum: number,userId: number | string, shopOrders: Set<BuyerOrder>, totalPrice: number, creationTime: Date) {
        this._orderNum = orderNum;
        this._userId = userId;
        this._shopOrders = shopOrders;
        this._totalPrice = totalPrice;
        this._creationTime = creationTime;
    }
    
    public get orderNum(): number {
        return this._orderNum;
    }
    
    public get creationTime(): Date {
        return this._creationTime;
    }
    public set creationTime(value: Date) {
        this._creationTime = value;
    }
    
    public get totalPrice(): number {
        return this._totalPrice;
    }
    public set totalPrice(value: number) {
        this._totalPrice = value;
    }
    
    public get shopOrders(): Set<BuyerOrder> {
        return this._shopOrders;
    }
    public set shopOrders(value: Set<BuyerOrder>) {
        this._shopOrders = value;
    }
    
    public get userId(): number | string {
        return this._userId;
    }  
}