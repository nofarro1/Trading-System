import {MessageBox, ILLiveNotificationSubscriber} from "./MessageBox";
import {AddedNewOffer2ShopMessage, Message, ShopPurchaseMessage, ShopStatusChangedMessage} from "./Message";
import {IMessageListener} from "./IEventPublishers";
import {Result} from "../../utilities/Result";
import {inject, injectable} from "inversify";
import "reflect-metadata";
import {TYPES} from "../../helpers/types";
import { SecurityController } from "../SecurityController";

@injectable()
export class MessageController implements IMessageListener<Message> {

    messageBoxes: Map<string, MessageBox>
    securityController:SecurityController;
    constructor(@inject(TYPES.SecurityController) securityController:SecurityController) {
        this.messageBoxes = new Map<string, MessageBox>();
        this.securityController = securityController
    }

    addMessageBox(memberId: string): Result<MessageBox | undefined> {
        if (!this.messageBoxes.has(memberId)) {
            let newMb = new MessageBox(memberId);
            this.messageBoxes.set(memberId, newMb);
            return new Result(true, newMb);
        }
        return new Result(false, undefined, "user already has a message box")
    }

    addSubscriberToBox(session: string, subscriber: ILLiveNotificationSubscriber): Result<void> {
        try {
            let username = this.securityController.hasActiveSession(session);
            let box = this.getMessageBox(username);
            box.subscribe(subscriber);
            return new Result<void>(true, undefined);
        } catch (e: any) {
            console.log(e.message)
            return new Result(false, undefined, e.message)
        }
    }

    removeSubscriberFromBox(session: string, subscriber: ILLiveNotificationSubscriber): Result<void> {
        try {
            let username = this.securityController.hasActiveSession(session)
            let box = this.getMessageBox(username);
            box.unsubscribe(subscriber);
            return new Result<void>(true, undefined);
        } catch (e) {
            console.log(e)
            return new Result(false, undefined, e.message)
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

    getMessages(memberId: string): Result<Message[]> {
        try {
            return Result.Ok(this.getMessageBox(memberId).getAllMessages())
        } catch (e) {
            console.log(e)
            return Result.Fail("No messages found for member", []);
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

    visitNewShopOffer(msg: AddedNewOffer2ShopMessage): void {
        let recipients = msg.recipients;
        for (let key of recipients) {
            this.messageBoxes.get(key)?.addMessage(msg)
        }
    }


}