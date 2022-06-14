import {inject, injectable} from "inversify";
import {MessageController} from "../domain/notifications/MessageController";
import {TYPES} from "../helpers/types";
import {Message} from "../domain/notifications/Message";
import {ILLiveNotificationSubscriber} from "../domain/notifications/MessageBox";
import {Socket} from "socket.io";

export class LiveNotificationSubscriber implements ILLiveNotificationSubscriber {
    get sessionId(): string {
        return this._sessionId;
    }

    private socket: Socket;
    private readonly _username: string;
    private _sessionId: string;


    constructor(socket: Socket) {
        this.socket = socket;
        this._username = socket.request.session.username;
        this._sessionId = socket.request.session.id;
    }



    onNewMessages(msgs: Message[]): void {
        this.socket.emit("NewMessages", msgs)
    }

}

@injectable()
export class NotificationService {
    private messageController:MessageController;

    constructor(@inject(TYPES.MessageController) messageController:MessageController) {
        this.messageController = messageController
    }


    subscribeToBox(sub:LiveNotificationSubscriber){
        return new Promise((resolve, reject)=> {
            const res = this.messageController.addSubscriberToBox(sub.sessionId, sub);
            res.ok ? resolve(res) : reject(res.message)
        })
    }

    unsubscribeToBox(sub:LiveNotificationSubscriber){
        return new Promise((resolve, reject)=> {
            const res = this.messageController.removeSubscriberFromBox(sub.sessionId, sub);
            res.ok ? resolve(res) : reject(res.message)
        })

    }

    sendMessage(message:Message){
        message.recipients.forEach( r => this.messageController.addMessage(r, message))
    }
}