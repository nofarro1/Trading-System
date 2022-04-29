import {IMessagePublisher, IMessageListener} from "../notifications/IEventPublishers";
import {ShopPurchaseMessage} from "../notifications/Messages";


export class PurchaseController implements IMessagePublisher<ShopPurchaseMessage> {
    subscriber: IMessageListener<ShopPurchaseMessage>;


    sub(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscriber = sub;
    }
    unsub(sub: IMessageListener<ShopPurchaseMessage>) {
        this.subscriber = null;
    }
    notify(message: ShopPurchaseMessage) {
        if(this.subscriber !== null)
            this.accept(this.subscriber, message);
        else
            throw new Error("No one to get the message");

    }
    accept(v: IMessageListener<ShopPurchaseMessage>, msg) {
        v.visitPurchaseEvent(msg)
    }

}