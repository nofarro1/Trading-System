import {MessageBox} from "../../../src/domain/notifications/MessageBox";
import {Message} from "../../../src/domain/notifications/Messages";

class TestMessage extends Message {

    content

    constructor(){
        super();
        this.content = "i'm A test message"
    }
    getContent(){
        return this.content;
    }

}


describe('messageBox - test', function () {


    let messageBox = new MessageBox(1);
    let simpleMessage = new TestMessage();
    let msgId = simpleMessage.id;

    test("added massage to box",() => {
        messageBox.addMessage(simpleMessage);
        expect(messageBox.unReadMessages).toContain(simpleMessage);
        expect(messageBox.messages.length).toBe(0);
    })
});
