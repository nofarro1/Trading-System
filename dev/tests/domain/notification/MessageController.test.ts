import {MessageBox, IIncomingMessageSubscriber} from "../../../src/domain/notifications/MessageBox";
import {GenericMessage, Message} from "../../../src/domain/notifications/Message";
import {Member} from "../../../src/domain/user/Member";
import {MessageController} from "../../../src/domain/notifications/MessageController";
import {ShoppingCart} from "../../../src/domain/user/ShoppingCart";



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
const id1 = "u1"
let cart1;
let tu1: Member;
let mb1 = new MessageBox(id1);

const id2 = "u2"
let cart2 = new ShoppingCart();
const tu2: Member = new Member(id2,cart2)
let mb2 = new MessageBox(id2);
let controller: MessageController
const tm1 = new TestMessage();
const tm2 = new TestMessage();
const tm3 = new TestMessage();
const gm1 = new GenericMessage("gm1 - hello");

describe('messageBox - test', function () {

    beforeEach(function () {
        cart1 = new ShoppingCart();
        tu1 = new Member(id1,cart1)
        mb1 = new MessageBox(id1);
        controller = new MessageController();
        controller.messageBoxes.set(id1, mb1)
        jest.clearAllMocks()
    })

    test("create new messageBox", () => {
        controller.addMessageBox(id2);
        expect(controller.messageBoxes.keys()).toContain(id1);
        expect([...controller.messageBoxes.keys()]).toContain(id2)
    })

    test("get Message from existing Box", () => {
        jest.mock('../../../src/domain/notifications/MessageBox')
        const addMessageMock = jest.spyOn(MessageBox.prototype, 'getMessage').mockImplementation((id) => {
                return tm1;
            }
        )
        mb1.addMessage(tm1);
        const mockCont = "i'm a mock";
        expect(controller.getMessage(id1, tm1.id)).toBe(tm1);
        expect(addMessageMock).lastReturnedWith(tm1);
    })

    test("get Box from non-exist", () => {
        expect(controller.getMessage(id2, tm1.id)).toBeInstanceOf(GenericMessage);
    })

    test("get messages - existing box ", () => {
        mb1.addMessage(tm1);
        mb1.addMessage(tm2);
        mb1.addMessage(tm3);
        const result = controller.getMessages(id1);
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
        controller.removeMessage(id1, tm1.id)
        expect(removeMessageMock).toBeCalledWith(tm1.id);


    })

    test("add Message - to box",() => {
        controller.addMessage(id1, tm1);
        expect(mb1.unReadMessages).toContain(tm1)
    })

    test("subscribe to box", () => {
        jest.mock('../../../src/domain/notifications/MessageBox')
        const subscribeMock = jest.spyOn(MessageBox.prototype, 'subscribe').mockImplementation(() => {
                console.log("i'm a mock");
            }
        )
        const onEvent = jest.fn();
        let sub: IIncomingMessageSubscriber = {
            onNewMessages:onEvent
        } as IIncomingMessageSubscriber;
        controller.addSubscriberToBox(id1,sub);
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
        let sub: IIncomingMessageSubscriber = {
            onNewMessages:onEvent
        } as IIncomingMessageSubscriber;
        controller.addSubscriberToBox(id1,sub);
        expect(mb1.subs).toContain(sub);
        //act
        controller.removeSubscriberFromBox(id1,sub);
        //check
        expect(unsubscribeMock).toBeCalledWith(sub);
    })



});
