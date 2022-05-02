import {UserID, UUIDGenerator} from "../../utilities/Utils";
import {ShopOrder} from "../purchase/ShopOrder";


export abstract class Message {
    id: UserID
    timestamp: number
    isRead: boolean

    protected constructor() {
        this.id = UUIDGenerator();
        this.timestamp = Date.now();
        this.isRead = false;
    }

    setIsRead(state: boolean): void {
        this.isRead = state;
    }

    abstract getContent(): string;

}

export class GenericMessage extends Message {
    content: any


    constructor(content: any) {
        super();
        this.content = content;
    }

    getContent(): string {
        return "";
    }

}


export class ShopPurchaseMessage extends Message {


    content: string;
    shopOwnersIds: UserID[]
    purchase: ShopOrder

    constructor(shopOrder: ShopOrder, shopOwners: UserID[], buyer: string) {
        super()
        this.purchase = shopOrder;
        this.shopOwnersIds = shopOwners;
        this.content = `hello Owner, member ${buyer}, has placed and order at your shop ${this.purchase}.\n
        order details: ${shopOrder}`
    }

    getContent(): string {
        return this.content;
    }
}


export class ShopStatusChangedMessage extends Message {

    content: string;
    shopOwnersIds: UserID[]


    constructor(status: boolean, shopOwners: UserID[], shopName: string) {
        super()
        this.shopOwnersIds = shopOwners;
        this.content = `hello Owner, We would like to notify you that the shop founder of '${shopName} ${status === true ? `opened the shop for business` : `closed the shop temporarily`}`
    }

    getContent(): string {
        return this.content;
    }
}
