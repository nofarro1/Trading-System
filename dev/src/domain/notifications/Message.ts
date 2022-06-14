import {UUIDGenerator} from "../../utilities/Utils";
import {BaseEntity, Column, Entity, ManyToMany, PrimaryColumn} from "typeorm";

@Entity()
export abstract class Message extends BaseEntity {
    @PrimaryColumn({type: "int", name: "id"})
    id: string;
    @Column({type: "int", name: "timestamp"})
    timestamp: number;
    @Column({type: "boolean", name: "is_read"})
    isRead: boolean;
    @Column({type: "text", name: "content"})
    private _content: string;
    @Column({type: "text", array: true, name: "recipients", transformer: {from: (value: string[]) => new Set<string>(value), to: (value: Set<string>) => Array.from(value)}}) //TODO - Foreign Key constraint (Many To Many)
    recipients: Set<string>;

    protected constructor(recpt: Set<string>, content: string) {
        super();
        this.id = UUIDGenerator();
        this.timestamp = Date.now();
        this.isRead = false;
        this._content = content;
        this.recipients = recpt;
    }

    setIsRead(state: boolean): void {
        this.isRead = state;
    }

    get content(): string {
        return this._content;
    }
}

export class SimpleMessage extends Message{
    constructor(recpt: Set<string>, content: string = "empty message") {
        super(recpt, content);
    }
}


export class ShopPurchaseMessage extends Message {
    purchase: string

    //todo: format content;
    constructor(shopOrder: string, shopOwners: Set<string>, buyer: string) {
        super(shopOwners, `hello Owner, member ${buyer}, has placed an order at your shop\n order: ${shopOrder}.\n'
        order details: ...`);
        this.purchase = shopOrder;
    }
}


export class ShopStatusChangedMessage extends Message {
    constructor(status: boolean, shopOwners: Set<string>, shopName: string) {
        super(shopOwners, `hello Owner, We would like to notify you that the shop founder of '${shopName} ${status === true ? `opened the shop for business` : `closed the shop temporarily`}`);
    }
}
