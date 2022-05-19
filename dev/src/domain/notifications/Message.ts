import {string, UUIDGenerator} from "../../utilities/Utils";
import {ShopOrder} from "../purchase/ShopOrder";
import {logger} from "../../helpers/logger"

export abstract class Message {
    id: string
    timestamp: number
    isRead: boolean
    recipients: Set<string>

    protected constructor(recpt:Set<string>) {
        this.id = UUIDGenerator();
        this.timestamp = Date.now();
        this.isRead = false;
        this.recipients = recpt;
    }

    setIsRead(state: boolean): void {
        this.isRead = state;
    }

    abstract getContent(): string;

}


export class ShopPurchaseMessage extends Message {


    content: string;
    purchase: ShopOrder

    //todo: format content;
    constructor(shopOrder: ShopOrder, shopOwners: Set<string>, buyer: string) {
        super(shopOwners)
        this.purchase = shopOrder;
        this.content = `hello Owner, member ${buyer}, has placed an order at your shop ${this.purchase}.\n
        order details: ...`
    }

    getContent(): string {
        return this.content;
    }
}


export class ShopStatusChangedMessage extends Message {

    content: string;
    recipients: Set<string>


    constructor(status: boolean, shopOwners:Set<string>, shopName: string) {
        super(shopOwners)
        this.recipients = shopOwners;
        this.content = `hello Owner, We would like to notify you that the shop founder of '${shopName} ${status === true ? `opened the shop for business` : `closed the shop temporarily`}`
    }

    getContent(): string {
        return this.content;
    }
}
