import {Id} from "../../utilities/Utils";
import {MessageBox} from "./MessageBox";

import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Messages";
import {IEventListener} from "./IEventPublishers";


export default class MessageController implements IEventListener<ShopPurchaseMessage | ShopStatusChangedMessage> {

    messageBoxes: Map<Id, MessageBox>

    onEvent(m: ShopPurchaseMessage | ShopStatusChangedMessage) {
        let recipients = m.shopOwnersIds;
        recipients.forEach((id) => this.messageBoxes[id].addMessage(m))
    }


}