import {Id} from "../../utilities/Utils";
import {MessageBox} from "./MessageBox";

import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Messages";
import {IMessageListener} from "./IEventPublishers";


export default class MessageController implements IMessageListener<Message> {

    messageBoxes: Map<Id, MessageBox>

    constructor() {
        this.messageBoxes = new Map<Id, MessageBox>();
    }

    // onEvent(m: ShopPurchaseMessage | ShopStatusChangedMessage) {
    //     let recipients = m.shopOwnersIds;
    //     recipients.forEach((id) => this.messageBoxes[id].addMessage(m))
    // }

    visitPurchaseEvent(msg: ShopPurchaseMessage) {
        let recipients = msg.shopOwnersIds;
        for( let key of recipients){
            this.messageBoxes.get(key)?.addMessage(msg)
        }

    }

    visitShopStatusChangedEvent(msg: ShopStatusChangedMessage) {
    }


}