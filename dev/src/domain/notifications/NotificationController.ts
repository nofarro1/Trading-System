import {NewMessageSubscriber} from "./MessageBox";
import {Message} from "./Messages";


class NotificationController implements NewMessageSubscriber {

    onNewMessages(msgs: Message[]): void {
        console.log("new messages:" + msgs)
    }

}