import {ILLiveNotificationSubscriber} from "./MessageBox";
import {Message} from "./Message";
import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";
import {injectable} from "inversify";
import "reflect-metadata";

@injectable()
export class NotificationController implements ILLiveNotificationSubscriber {

    private activeMembers: Map<string,(m:Message) => void>

    constructor() {
        this.activeMembers = new Map();
    }

    onNewMessages(msgs: Message[]): void {
        for(let msg of msgs){
            for(let resp of msg.recipients){
                const sendNotification:((m:Message) => void) | undefined = this.activeMembers.get(resp)
                if(sendNotification){
                    sendNotification(msg);
                }
            }
        }
        console.log("new messages:" + msgs)
    }

    addActiveUser(id:string): Result<void> {
        if(!this.activeMembers.has(id)){
            const messageCallback = (message:any) => {
                logger.info(message)
                //get connection with websockets
                //send the message
            };
            this.activeMembers.set(id,messageCallback);
            return new Result(true,undefined,"member is connected to live notifications");
        } else {
            return new Result(false,undefined, "member")
        }
    }

    removeActiveUser(id:string): Result<void>{
        const removed = this.activeMembers.delete(id);
        return new Result(removed,undefined);

    }


}