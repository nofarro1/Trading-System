import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Messages";


export interface IEventPublisher<T extends Message> {
    subs: IEventListener<T>[]
    sub(sub:IEventListener<T>)
    unsub(sub:IEventListener<T>)
    notify(message: T)

}

export interface IEventListener<T extends Message> {
    onEvent(m:T),

}


class ShopEventPublisher implements IEventPublisher<Message> {

    subs: IEventListener<ShopPurchaseMessage|ShopStatusChangedMessage>[];

    constructor() {
        this.subs = [];
    }

    notify(message: ShopPurchaseMessage | ShopStatusChangedMessage) {
        if (this.subs.length > 0) {
            this.subs.forEach(sub => sub.onEvent(message));
        }
    }


    sub(sub: IEventListener<ShopPurchaseMessage>) {
        if(!this.subs.includes(sub)){
            this.subs.push(sub);
        }
    }

    unsub(sub: IEventListener<ShopPurchaseMessage>) {
        let index = this.subs.findIndex((l) => sub === l);
        index !== -1 ? this.subs.splice(index, 1) : this.subs;
    }

}

