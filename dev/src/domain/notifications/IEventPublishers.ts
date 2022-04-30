import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Message";


export interface IMessagePublisher<T extends Message> {
    subscriber: IMessageListener<T>
    subscribe(sub:IMessageListener<T>)
    unsub(sub:IMessageListener<T>)
    notify(message: T)
    accept(v: IMessageListener<T>, msg: T)
}

export interface IMessageListener<T extends Message> {
    visitPurchaseEvent(msg:ShopPurchaseMessage)
    visitShopStatusChangedEvent(msg:ShopStatusChangedMessage)


}


// class ShopEventPublisher implements IEventPublisher<Message> {
//
//     subs: IMessageListener<ShopPurchaseMessage|ShopStatusChangedMessage>[];
//
//     constructor() {
//         this.subs = [];
//     }
//
//     notify(message: ShopPurchaseMessage | ShopStatusChangedMessage) {
//         if (this.subs.length > 0) {
//             this.subs.forEach(sub => sub.onEvent(message));
//         }
//     }
//
//
//     sub(sub: IMessageListener<ShopPurchaseMessage|ShopStatusChangedMessage>) {
//         if(!this.subs.includes(sub)){
//             this.subs.push(sub);
//         }
//     }
//
//     unsub(sub: IMessageListener<ShopPurchaseMessage|ShopStatusChangedMessage>) {
//         let index = this.subs.findIndex((l) => sub === l);
//         index !== -1 ? this.subs.splice(index, 1) : this.subs;
//     }
//
// }

