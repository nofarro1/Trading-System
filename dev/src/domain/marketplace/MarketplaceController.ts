import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../notifications/Messages";


export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage> {
    subscriber: IMessageListener<ShopStatusChangedMessage>;

    accept(v: IMessageListener<ShopStatusChangedMessage>, msg: ShopStatusChangedMessage) {
        v.visitShopStatusChangedEvent(msg);
    }

    notify(message: ShopStatusChangedMessage) {
        if(this.subscriber !== null)
            this.accept(this.subscriber, message);
        else
            throw new Error("No one to get the message");
    }

    sub(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = sub;
    }

    unsub(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = null;
    }

}