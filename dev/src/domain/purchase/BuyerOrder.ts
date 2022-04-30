import { ShopOrder } from "./ShopOrder";


export enum OrderStatus {
    Approved,
    Packed,
    Sent
}
export class BuyerOrder {
    private orderNum: number;
    private userId: number;
    private shopOrders: ShopOrder[];
    private totalPrice: number;
    private creationTime: string;

    constructor(orderNum: number, shopOrders: ShopOrder[], totalPrice: number, creationTime: string) {
        this.orderNum = orderNum;
        this.shopOrders = shopOrders;
        this.totalPrice = totalPrice;
        this.creationTime = creationTime;
    }

}