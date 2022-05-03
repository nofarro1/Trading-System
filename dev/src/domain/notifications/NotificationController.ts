import {NewMessageSubscriber} from "./MessageBox";
import {Message} from "./Message";
import {Member} from "../user/Member";
import {Result} from "../../utilities/Result";
import {logger} from "../../helpers/logger";



export class NotificationController implements NewMessageSubscriber {

    private activeMembers: Map<string,(m:Message) => void>


    constructor() {
        this.activeMembers = new Map();
    }

    onNewMessages(msgs: Message[]): void {
        console.log("new messages:" + msgs)
    }

    addActiveUser(id:string): Result<void> {
        if(!this.activeMembers.has(id)){
            const messageCallback = (message:any) => logger.info(message);
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