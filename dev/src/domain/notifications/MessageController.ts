import {UserID} from "../../utilities/Utils";
import {MessageBox, NewMessageSubscriber} from "./MessageBox";

import {GenericMessage, Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Messages";
import {IMessageListener} from "./IEventPublishers";
import {Result} from "../../utilities/Result";


export default class MessageController implements IMessageListener<Message> {

    messageBoxes: Map<UserID, MessageBox>

    constructor() {
        this.messageBoxes = new Map<UserID, MessageBox>();
    }


    addMessageBox(memberId: UserID): void {
        if (!this.messageBoxes.has(memberId)) {
            let newMb = new MessageBox(memberId);
            this.messageBoxes.set(memberId, newMb);
        }
    }

    addSubscriberToBox(memberId: UserID, subscriber: NewMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.subscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    removeSubscriberFromBox(memberId: UserID, subscriber: NewMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.unsubscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    addMessage(memberId: UserID, message: Message): void {
        try {
            this.getMessageBox(memberId).addMessage(message)
        } catch (e) {
            console.log(e)
        }

    }

    private getMessageBox(memberId: UserID): MessageBox {
        if (this.messageBoxes.has(memberId)) {
            return this.messageBoxes.get(memberId) as MessageBox
        } else {
            throw new Error("no mailbox matches the recipient")
        }
    }

    getMessages(memberId: UserID): Message[] {
        try {
            return this.getMessageBox(memberId).getAllMessages()
        } catch (e) {
            console.log(e)
            return [];
        }
    }

    getMessage(memberId: UserID, msgId:UserID): Message {
        try {
            let box= this.getMessageBox(memberId);
            return box.getMessage(msgId)
        } catch(e) {
            return new GenericMessage(e)
        }

    }

    removeMessage(memberId: UserID, messageId: UserID): void {
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