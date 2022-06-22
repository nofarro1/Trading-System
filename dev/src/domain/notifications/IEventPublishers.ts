import {AddedNewOffer2ShopMessage, Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Message";


export interface IMessagePublisher<T extends Message> {
    subscribe(sub:IMessageListener<T>): void
    unsubscribe(sub:IMessageListener<T>): void
    notifySubscribers(message: Message): void
    accept(v: IMessageListener<T>, msg: T): void
}

export interface IMessageListener<T extends Message> {
    visitPurchaseEvent(msg:ShopPurchaseMessage): void
    visitShopStatusChangedEvent(msg:ShopStatusChangedMessage): void
    visitNewShopOffer(msg: AddedNewOffer2ShopMessage): void
}


