import {MessageBox, NewMessageSubscriber} from "../../../src/domain/notifications/MessageBox";
import {Member} from "../../../src/domain/User/Member";
import { UserController } from "./UserController";

class TestUserController extends UserController {

    constructor() {
        super();
    }

}

const tu1: Member = new Member("u1")
let mb1: MessageBox;

const tm1 = new TestMessage();
const tm2 = new TestMessage();
const tm3 = new TestMessage();


describe('messageBox - test', function () {

    beforeEach(function () {
        mb1 = new MessageBox(tu1.id);
    })

    test("added massage to box", () => {
        mb1.addMessage(tm1);
        expect(mb1.unReadMessages).toContain(tm1);
        expect(mb1.messages.length).toBe(0);
        expect(mb1.unReadMessages.length).toBe(1);
    })

    test("get massage from box", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        const message = mb1.getMessage(mId);
        expect(message).not.toBeNull();
        expect(message).toEqual(tm1);
        expect(mb1.messages).toContain(tm1);
        expect(mb1.messages.length).toBe(1);
        expect(mb1.unReadMessages.length).toBe(0);
    })

    test("get message - should throw", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(() => mb1.getMessage("hi")).toThrow()
    })

    test("get all massages from box", () => {
        mb1.addMessage(tm1);
        mb1.addMessage(tm2);
        mb1.addMessage(tm3);
        expect(mb1.unReadMessages.length).toBe(3);
        expect(mb1.messages.length).toBe(0);

        let messages = mb1.getAllMessages();
        expect(messages.length).toBe(3);
        expect(mb1.unReadMessages.length).toBe(0);

    })

    test("remove message form box - in unread message", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(mb1.unReadMessages).toContain(tm1);
        expect(mb1.unReadMessages.length).toBe(1);

        mb1.removeMessage(mId);
        expect(mb1.unReadMessages).not.toContain(tm1);
        expect(mb1.unReadMessages.length).toBe(0);

    })

    test("remove message from - in messages", () => {
        mb1.addMessage(tm1);
        const mId = tm1.id;
        expect(mb1.unReadMessages).toContain(tm1);
        expect(mb1.unReadMessages.length).toBe(1);
        const message = mb1.getMessage(mId);
        mb1.removeMessage(mId);
        expect(mb1.messages).not.toContain(tm1);
        expect(mb1.unReadMessages.length).toBe(0);
        expect(mb1.messages.length).toBe(0);
    })

    test("subscribe to mailbox and notify", () => {
        const onEvent = jest.fn();
        let sub: NewMessageSubscriber = {
            onNewMessages:onEvent
        } as NewMessageSubscriber;

        mb1.subscribe(sub);
        expect(mb1.subs).toContain(sub);
        mb1.addMessage(tm1)
        expect(onEvent).toBeCalledWith([tm1])


    })

    test("no sub unsub", () => {
        const onEvent = jest.fn();
        let sub: NewMessageSubscriber = {
            onNewMessages:onEvent
        } as NewMessageSubscriber;
        mb1.subscribe(sub);
        mb1.unsubscribe(sub);
        expect(mb1.subs).toHaveLength(0);
        mb1.addMessage(tm1)
        expect(onEvent).not.toBeCalledWith()
    })


});
