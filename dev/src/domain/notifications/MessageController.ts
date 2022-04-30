import {Id} from "../../utilities/Utils";
import {MessageBox, NewMessageSubscriber} from "./MessageBox";

import {GenericMessage, Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Messages";
import {IMessageListener} from "./IEventPublishers";
import {Result} from "../../utilities/Result";


export default class MessageController implements IMessageListener<Message> {

    messageBoxes: Map<Id, MessageBox>

    constructor() {
        this.messageBoxes = new Map<Id, MessageBox>();
    }


    addMessageBox(memberId: Id): void {
        if (!this.messageBoxes.has(memberId)) {
            let newMb = new MessageBox(memberId);
            this.messageBoxes.set(memberId, newMb);
        }
    }

    addSubscriberToBox(memberId: Id, subscriber: NewMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.subscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    removeSubscriberFromBox(memberId: Id, subscriber: NewMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.unsubscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    addMessage(memberId: Id, message: Message): void {
        try {
            this.getMessageBox(memberId).addMessage(message)
        } catch (e) {
            console.log(e)
        }

    }

    private getMessageBox(memberId: Id): MessageBox {
        if (this.messageBoxes.has(memberId)) {
            return this.messageBoxes.get(memberId) as MessageBox
        } else {
            throw new Error("no mailbox matches the recipient")
        }
    }

    getMessages(memberId: Id): Message[] {
        try {
            return this.getMessageBox(memberId).getAllMessages()
        } catch (e) {
            console.log(e)
            return [];
        }
    }

    getMessage(memberId: Id, msgId:Id): Message {
        try {
            let box= this.getMessageBox(memberId);
            return box.getMessage(msgId)
        } catch(e) {
            return new GenericMessage(e)
        }

    }

    removeMessage(memberId: Id, messageId: Id): void {
        try {
            this.getMessageBox(memberId).removeMessage(messageId)
        } catch (e) {
            console.log(e)
        }
    }

    visitPurchaseEvent(msg: ShopPurchaseMessage): void {
        let recipients = msg.shopOwnersIds;
        for (let key of recipients) {
            this.messageBoxes.get(key)?.addMessage(msg)
        }

    }

    visitShopStatusChangedEvent(msg: ShopStatusChangedMessage): void {
        let recipients = msg.shopOwnersIds;
        for (let key of recipients) {
            this.messageBoxes.get(key)?.addMessage(msg)
        }
    }


}