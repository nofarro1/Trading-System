import {Message} from "./Message";


export interface ILLiveNotificationSubscriber {
    onNewMessages(msgs: Message[]): void;
}

export interface ILiveNotificationPublisher {
    subs: ILLiveNotificationSubscriber[];

    subscribe(l: ILLiveNotificationSubscriber): void;
    unsubscribe(l: ILLiveNotificationSubscriber): void;
    notifySubscribers(messages: Message[]): void;
}


export class MessageBox implements ILiveNotificationPublisher {
    private memberId: string
    messages: Message[]
    unreadMessages: Message[]
    subs: ILLiveNotificationSubscriber[]

    constructor(member: string) {
        this.messages = [];
        this.unreadMessages = []
        this.subs = []
        this.memberId = member
    }

    addMessage(message: Message): void {
        this.unreadMessages.push(message);
        this.notifySubscribers(this.unreadMessages);
    }

    removeMessage(messageId: string): void {
        let index = this.messages.findIndex(m => m.id === messageId);
        let indexUnread = this.unreadMessages.findIndex(m => m.id === messageId);
        index !== -1 ? this.messages.splice(index, 1) : this.messages;
        indexUnread !== -1 ? this.unreadMessages.splice(indexUnread, 1) : this.messages;
    }

    getAllMessages(): Message[] {
        this.updateUnreadMessages();
        return this.messages
    }

    getMessage(message: string): Message {
        let from_messages = this.messages.find(m => m.id === message);
        if (from_messages !== undefined) {
            return from_messages
        } else {
            let from_messagesUnread = this.unreadMessages.find(m => m.id === message);
            if (from_messagesUnread !== undefined) {
                this.unreadMessages.splice(this.unreadMessages.indexOf(from_messagesUnread), 1);
                this.messages.push(from_messagesUnread);
                return from_messagesUnread;
            } else {
                throw new Error(`no message with id ${message} was found`);
            }
        }
    }

    private updateUnreadMessages(): void {
        this.messages.forEach(m => m.setIsRead(true))
        this.messages.push(...this.unreadMessages)
        this.unreadMessages = []
    }

    notifySubscribers(messages: Message[]): void {
        if (this.subs.length > 0) {
            this.subs.forEach(sub => sub.onNewMessages(this.messages));
            this.updateUnreadMessages();
        }
    }

    subscribe(l: ILLiveNotificationSubscriber): void {
        if (!this.subs.includes(l)) {
            this.subs.push(l);
        }
    }

    unsubscribe(sub: ILLiveNotificationSubscriber): void {
        let index = this.subs.findIndex((l) => sub === l);
        index !== -1 ? this.subs.splice(index, 1) : this.subs;

    }
}
