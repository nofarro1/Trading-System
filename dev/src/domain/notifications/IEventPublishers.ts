import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Message";


export interface IMessagePublisher<T extends Message> {
    subscriber: IMessageListener<T> | null
    subscribe(sub:IMessageListener<T>): void
    unsub(sub:IMessageListener<T>): void
    notify(message: T): void
    accept(v: IMessageListener<T>, msg: T): void
}

export interface IMessageListener<T extends Message> {
    visitPurchaseEvent(msg:ShopPurchaseMessage): void
    visitShopStatusChangedEvent(msg:ShopStatusChangedMessage): void
}


