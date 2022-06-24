import {UUIDGenerator} from "../../utilities/Utils";
import {Offer} from "../user/Offer";
import {AppointmentAgreement} from "../marketplace/AppointmentAgreement";
import {Shop} from "../marketplace/Shop";

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
        this.content = `Hello Owner, We would like to notify you that the shop founder of '${shopName} ${status === true ? `opened the shop for business` : `closed the shop temporarily`}`
    }

    getContent(): string {
        return this.content;
    }
}

export class AddedNewOffer2ShopMessage extends Message {
    content: string;

    constructor(recpt: Set<string>, offer: Offer, shopName: string) {
        super(recpt);
        this.content = `Hello Owner, we would like to notify you that a bid on product with id: ${offer.id} as been filing in ${shopName} shop.`
    }

    getContent(): string {
        return this.content;
    }
}

export class counterOfferMessage extends Message {
    content: string;
    constructor(offer: Offer, shopName: string){
        super(new Set<string>().add(offer.user));
        this.content = `Hello ${offer.user}, we would like to notify you that a counter bid has been placed on the bid you submitted-on for the product with id: ${offer.pId} in ${shopName} shop.\n The bid is ${offer.price}.`
    }
    getContent(): string {
        return this.content;
    }
}

export class appointmentAgreementMessage extends Message {
    content: string;
    constructor(agreement: AppointmentAgreement, shopName: string, approves: Set<string>){
        super(approves);
        this.content = `Hello, ${agreement.assigner} submitted ${agreement.member} candidacy for a shop owner in shop- ${shopName}. `
    }

    getContent(): string {
        return this.content;
    }
}

export class apponitmentApprovedMessage extends Message{
    content: string;
    constructor(shopName: string, member: string){
        super(new Set<string>().add(member));
        this.content = `Congratulation ${member}! Your shop owner appointment in ${shopName} has been approved by all shop owners. Soon you will be appointed.`
    }
    getContent(): string {
        return this.content;
    }
}

export class newOwnerInShopMessage extends Message{
    content: string;
    constructor(shop: Shop, member: string){
        super(shop.shopOwners);
        this.content = `${member} has been appointed a shop owner in your shop - ${shop.name}.`;
    }
    getContent(): string {
        return this.content;
    }
}
