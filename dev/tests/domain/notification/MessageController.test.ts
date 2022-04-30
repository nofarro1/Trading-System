import {MessageBox, NewMessageSubscriber} from "../../../src/domain/notifications/MessageBox";
import {GenericMessage, Message} from "../../../src/domain/notifications/Messages";
import {Member} from "../../../src/domain/user/Member";
import MessageController from "../../../src/domain/notifications/MessageController";
import {Id} from "../../../src/utilities/Utils";

class TestMessage extends Message {

    content

    constructor() {
        super();
        this.content = "i'm A test message"
    }

    getContent() {
        return this.content;
    }

}

const tu1: Member = new Member("u1")
const tu2: Member = new Member("u2")
let mb1 = new MessageBox(tu1.id);
let controller: MessageController
const tm1 = new TestMessage();
const tm2 = new TestMessage();
const tm3 = new TestMessage();
const gm1 = new GenericMessage("gm1 - hello");

describe('messageBox - test', function () {

    beforeEach(function () {
        controller = new MessageController();
        controller.messageBoxes.set(tu1.id, mb1)
        jest.clearAllMocks()
    })

    test("create new messageBox", () => {
        controller.addMessageBox(tu2.id);
        expect(controller.messageBoxes.keys()).toContain(tu1.id);
        expect([...controller.messageBoxes.keys()]).toContain(tu2.id)
    })

    test("get Message from existing Box", () => {
        jest.mock('../../../src/domain/notifications/MessageBox')
        const addMessageMock = jest.spyOn(MessageBox.prototype, 'getMessage').mockImplementation((id) => {
                return tm1;
            }
        )
        mb1.addMessage(tm1);
        const mockCont = "i'm a mock";
        expect(controller.getMessage(tu1.id, tm1.id)).toBe(tm1);
        expect(addMessageMock).lastReturnedWith(tm1);
    })

    test("get Box from non-exist", () => {
        expect(controller.getMessage(tu2.id, tm1.id)).toBeInstanceOf(GenericMessage);
    })

    test("get messages - existing box ", () => {
        mb1.addMessage(tm1);
        mb1.addMessage(tm2);
        mb1.addMessage(tm3);
        const result = controller.getMessages(tu1.id);
        expect(result).toEqual([tm1, tm2, tm3]);
        expect(result).toHaveLength(3);
    })

    test("remove messages - existing box", () => {
        jest.mock('../../../src/domain/notifications/MessageBox')
        const removeMessageMock = jest.spyOn(MessageBox.prototype, 'removeMessage').mockImplementation(() => {
                console.log("i'm a mock");
            }
        )
        mb1.addMessage(tm1);
        controller.removeMessage(tu1.id, tm1.id)
        expect(removeMessageMock).toBeCalledWith(tm1.id);


    })

    test("add Message - to box",() => {
        controller.addMessage(tu1.id, tm1);
        expect(mb1.unReadMessages).toContain(tm1)
    })

    test("subscribe to box", () => {
        jest.mock('../../../src/domain/notifications/MessageBox')
        const subscribeMock = jest.spyOn(MessageBox.prototype, 'subscribe').mockImplementation(() => {
                console.log("i'm a mock");
            }
        )
        const onEvent = jest.fn();
        let sub: NewMessageSubscriber = {
            onNewMessages:onEvent
        } as NewMessageSubscriber;
        controller.addSubscriberToBox(tu1.id,sub);
        expect(subscribeMock).toBeCalledWith(sub);
    })


    test("unsubscribe to box", () => {
        //prep
        jest.mock('../../../src/domain/notifications/MessageBox')
        const unsubscribeMock = jest.spyOn(MessageBox.prototype, 'unsubscribe').mockImplementation(() => {
                console.log("i'm a mock");
            }
        )
        const onEvent = jest.fn();
        let sub: NewMessageSubscriber = {
            onNewMessages:onEvent
        } as NewMessageSubscriber;
        controller.addSubscriberToBox(tu1.id,sub);
        expect(mb1.subs).toContain(sub);
        //act
        controller.removeSubscriberFromBox(tu1.id,sub);
        //check
        expect(unsubscribeMock).toBeCalledWith(sub);
    })



});
