import {IMessageListener, IMessagePublisher} from "../notifications/IEventPublishers";
import {ShopStatusChangedMessage} from "../notifications/Messages";
import {Shop} from "./Shop";


export class MarketplaceController implements IMessagePublisher<ShopStatusChangedMessage> {
    shops: Map<number,Shop>

    constructor(){
        this.shops = new Map<number, Shop>();
    }


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

    subscribe(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = sub;
    }

    unsub(sub: IMessageListener<ShopStatusChangedMessage>) {
        this.subscriber = null;
    }

}