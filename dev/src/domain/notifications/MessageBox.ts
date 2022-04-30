import {Message} from "./Messages";
import {Member} from "../user/Member";
import {Id} from "../../utilities/Utils";


export interface NewMessageSubscriber {
    onNewMessages(msgs: Message[]):void

}

export interface NewMessagePublisher {
    subs:NewMessageSubscriber[]
    subscribe(l:NewMessageSubscriber):void
    unsubscribe(l:NewMessageSubscriber):void
    notifySubscribers(messages: Message[]):void
}




export class MessageBox implements NewMessagePublisher{

    private memberId: Id
    messages: Message[]
    unReadMessages: Message[]
    subs: NewMessageSubscriber[]


    constructor(member:Id) {
        this.messages = [];
        this.unReadMessages = []
        this.subs = []
        this.memberId = member
    }

    addMessage(message: Message): void {
        this.unReadMessages.push(message);
        this.notifySubscribers(this.unReadMessages);
    }

    removeMessage(messageId:Id): void {
        let index = this.messages.findIndex(m=> m.id === messageId);
        let indexUnread = this.unReadMessages.findIndex(m=> m.id === messageId);
        index !== -1 ? this.messages.splice(index, 1) : this.messages;
        indexUnread !== -1 ? this.unReadMessages.splice(indexUnread, 1) : this.messages;
    }

    getAllMessages(): Message[] {
        this.updateUnreadMessages();
        return this.messages
    }

    getMessage(message:Id): Message {
        let from_messages = this.messages.find(m => m.id === message);
        if (from_messages !== undefined) {
            return from_messages
        } else {
            let from_messagesUnread = this.unReadMessages.find(m => m.id === message);
            if (from_messagesUnread !== undefined) {
                this.unReadMessages.splice(this.unReadMessages.indexOf(from_messagesUnread),1);
                this.messages.push(from_messagesUnread);
                return from_messagesUnread;
            } else {
                throw new Error(`no message with id ${message} was found`);
            }
        }

    }

    private updateUnreadMessages():void {
        this.messages.forEach(m => m.setIsRead(true))
       this.messages.push(...this.unReadMessages)
        this.unReadMessages = []
    }

    notifySubscribers(messages: Message[]): void {
        if(this.subs.length > 0) {
            this.subs.forEach(sub => sub.onNewMessages(this.messages));
            this.updateUnreadMessages();
        } else {

        }
    }

    subscribe(l: NewMessageSubscriber): void {
        if(!this.subs.includes(l)){
            this.subs.push(l);
        }
    }

    unsubscribe(sub: NewMessageSubscriber): void {
        let index = this.subs.findIndex((l) => sub === l);
        index !== -1 ? this.subs.splice(index, 1) : this.subs;

    }

}