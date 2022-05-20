import {MessageBox, IIncomingMessageSubscriber} from "./MessageBox";
import {Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Message";
import {IMessageListener} from "./IEventPublishers";
import {Result} from "../../utilities/Result";


export class MessageController implements IMessageListener<Message> {

    messageBoxes: Map<string, MessageBox>

    constructor() {
        this.messageBoxes = new Map<string, MessageBox>();
    }


    addMessageBox(memberId: string): Result<MessageBox| undefined> {
        if (!this.messageBoxes.has(memberId)) {
            let newMb = new MessageBox(memberId);
            this.messageBoxes.set(memberId, newMb);
            return new Result(true, newMb);
        }
        return new Result(false,undefined,"user already has a message box")
    }

    addSubscriberToBox(memberId: string, subscriber: IIncomingMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.subscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    removeSubscriberFromBox(memberId: string, subscriber: IIncomingMessageSubscriber): void {
        try {
            let box =  this.getMessageBox(memberId);
            box.unsubscribe(subscriber);
        }catch (e) {
            console.log(e)
        }
    }

    addMessage(memberId: string, message: Message): void {
        try {
            this.getMessageBox(memberId).addMessage(message)
        } catch (e) {
            console.log(e)
        }

    }

    private getMessageBox(memberId: string): MessageBox {
        if (this.messageBoxes.has(memberId)) {
            return this.messageBoxes.get(memberId) as MessageBox
        } else {
            throw new Error("no mailbox matches the recipient")
        }
    }

    getMessages(memberId: string): Message[] {
        try {
            return this.getMessageBox(memberId).getAllMessages()
        } catch (e) {
            console.log(e)
            return [];
        }
    }

    removeMessage(memberId: string, messageId: string): void {
        try {
            this.getMessageBox(memberId).removeMessage(messageId)
        } catch (e) {
            console.log(e)
        }
    }

    visitPurchaseEvent(msg: ShopPurchaseMessage): void {
        let recipients = msg.recipients;
        for (let key of recipients) {
            this.messageBoxes.get(key)?.addMessage(msg)
        }

    }

    visitShopStatusChangedEvent(msg: ShopStatusChangedMessage): void {
        let recipients = msg.recipients;
        for (let key of recipients) {
            this.messageBoxes.get(key)?.addMessage(msg)
        }
    }


}