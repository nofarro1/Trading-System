import {UUIDGenerator} from "../../utilities/Utils";

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

export class SimpleMessage extends Message{
    content: string;

    constructor(recpt: Set<string>, content: string = "empty message") {
        super(recpt);
        this.content = content;
        
    }

    getContent(): string {
        return this.content;
    }
}


export class ShopPurchaseMessage extends Message {


    content: string;
    purchase: string

    //todo: format content;
    constructor(shopOrder: string, shopOwners: Set<string>, buyer: string) {
        super(shopOwners)
        this.purchase = shopOrder;
        this.content = `hello Owner, member ${buyer}, has placed an order at your shop\n order: ${this.purchase}.\n`
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
